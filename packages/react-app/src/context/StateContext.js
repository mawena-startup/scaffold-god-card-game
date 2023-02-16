import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  // useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState, createContext, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NETWORKS, ALCHEMY_KEY } from "../constants";
import externalContracts from "../contracts/external_contracts";
// contracts
import deployedContracts from "./hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "../helpers";

import { useStaticJsonRPC } from "../hooks";

// custome import
import { GetParams } from "../utils/onboard.js";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { createEventListeners } from "./createEventListeners";
import { playAudio, sparcle } from "../utils/animation.js";
import { defenseSound } from "../assets";

const { ethers } = require("ethers");

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.goerli; // <------- select your target frontend network (localhost, goerli, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

const Context = createContext();

const StateContext = ({ children }) => {
  // this section sets your provider ============================
  const networkOptions = [initialNetwork.name, "mainnet", "goerli"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  //custom context

  const [battleGround, setBattleGround] = useState("url('/src/assets/background/astral.jpg')");
  const [step, setStep] = useState(1);
  const [gameData, setGameData] = useState({ players: [], pendingBattles: [], activeBattle: null });
  const [showAlert, setShowAlert] = useState({ status: false, type: "info", message: "" });
  const [battleName, setBattleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [contract, setContract] = useState(null);
  const [updateGameData, setUpdateGameData] = useState(0);
  const [checkNewPlayer, setCheckNewPlayer] = useState(false);
  const [checkNewBattle, setCheckNewBattle] = useState(false);
  const [checkBattleEnded, setCheckBattleEnded] = useState(false);
  const [checkRoundEnded, setCheckRoundEnded] = useState(false);
  const [battleStateChange, setBattleStateChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const player1Ref = useRef();
  const player2Ref = useRef();

  let navigate = useNavigate();
  //* Set battleground to local storage
  useEffect(() => {
    const isBattleground = localStorage.getItem("battleground");

    if (isBattleground) {
      setBattleGround(isBattleground);
    } else {
      localStorage.setItem("battleground", battleGround);
    }
  }, []);

  //* Reset web3 onboarding modal params
  // useEffect(() => {
  //   const resetParams = async () => {
  //     const currentStep = await GetParams();

  //     setStep(currentStep.step);
  //   };

  //   resetParams();

  //   window?.ethereum?.on('chainChanged', () => resetParams());
  //   window?.ethereum?.on('accountsChanged', () => resetParams());
  // }, []);

  //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason?.slice("execution reverted: ".length).slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  const mainnetProvider = useStaticJsonRPC(providers, localProvider);

  // Sensible pollTimes depending on the provider you are using

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
  //  can be called on your logout button
  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  //* Set the contract that can be used to interact with the smart
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      if (userSigner) {
        const newContract = new ethers.Contract(
          deployedContracts[targetNetwork.chainId].goerli.contracts.ScaffoldGods.address,
          deployedContracts[targetNetwork.chainId].goerli.contracts.ScaffoldGods.abi,
          userSigner,
        );

        setContract(newContract);
      }
    };

    setSmartContractAndProvider();
  }, [address, selectedNetwork, localProvider, userSigner, targetNetwork]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  //* Get battle card coordinates
  const getCoords = cardRef => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();

    return {
      pageX: left + width / 2,
      pageY: top + height / 2.25,
    };
  };

  const emptyAccount = "0x0000000000000000000000000000000000000000";

  // 📟 Listen for broadcast events
  const newPlayerEvents = useEventListener(readContracts, "ScaffoldGods", "NewPlayer", injectedProvider, 1);
  if (newPlayerEvents[0]?.args[0] && !checkNewPlayer) {
    if (address === newPlayerEvents[0]?.args[0]) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
    setCheckNewPlayer(true);
    console.log(newPlayerEvents[0]?.args?.owner, "calling the new player event from state context");
  }

  //new battle event check here
  const newBattleEvents = useEventListener(readContracts, "ScaffoldGods", "NewBattle", injectedProvider, 1);
  if (newBattleEvents[0]?.args && !checkNewBattle && address) {
    if (
      address.toLowerCase() === newBattleEvents[0]?.args.player1.toLowerCase() ||
      address.toLowerCase() === newBattleEvents[0]?.args.player2.toLowerCase()
    ) {
      navigate(`/battle/${newBattleEvents[0]?.args.battleName}`);
    }

    setUpdateGameData(prevUpdateGameData => prevUpdateGameData + 1);
    setCheckNewBattle(true);
    console.log(newBattleEvents[0]?.args, "calling the new battle event from state context");
  }

  const newBattleEventMove = useEventListener(readContracts, "ScaffoldGods", "BattleMove", injectedProvider, 1);
  if (newBattleEventMove[0]?.args) {
    console.log(newBattleEventMove[0]?.args, " battle move event from state context");
  }

  const newRoundEndedEvent = useEventListener(readContracts, "ScaffoldGods", "RoundEnded", injectedProvider, 1);

  if (newRoundEndedEvent[0]?.args && !checkRoundEnded) {
    for (let i = 0; i < newRoundEndedEvent[0]?.args.damagedPlayers.length; i += 1) {
      if (newRoundEndedEvent[0]?.args.damagedPlayers[i] !== emptyAccount) {
        if (newRoundEndedEvent[0]?.args.damagedPlayers[i] === address) {
          sparcle(getCoords(player1Ref));
        } else if (newRoundEndedEvent[0]?.args.damagedPlayers[i] !== address) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData(prevUpdateGameData => prevUpdateGameData + 1);

    setCheckRoundEnded(true);
    console.log(newRoundEndedEvent[0]?.args, " round ended from state context");
  }

  const newBattleEventEnded = useEventListener(readContracts, "ScaffoldGods", "BattleEnded", injectedProvider, 1);
  // console.log(newBattleEventEnded[0]?.args, "battle ended");
  if (newBattleEventEnded[0]?.args && !checkBattleEnded) {
    console.log(newBattleEventEnded[0]?.args, " battle ended from state context");
    if (address.toLowerCase() === newBattleEventEnded[0]?.args.winner.toLowerCase()) {
      setShowAlert({ status: true, type: "success", message: "You won!" });
    } else if (address.toLowerCase() === newBattleEventEnded[0]?.args.loser.toLowerCase()) {
      setShowAlert({ status: true, type: "failure", message: "You lost!" });
    }

    navigate("/create-battle");
    setCheckBattleEnded(true);
  }

  //handling every envent
  // useEffect(() => {
  //   if (newBattleEvents.length > 0) {

  //   }
  // }, [newBattleEvents]);
  // If you want to call a function on a new block
  // useOnBlock(mainnetProvider, () => {
  //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  // });

  //* Set the game data to the state
  // const fetchedAllBattles = useContractReader(readContracts, 'ScaffoldGods', 'getAllBattles');
  // console.log('all battles', fetchedAllBattles);
  useEffect(() => {
    const fetchGameData = async () => {
      if (contract) {
        const fetchedBattles = await contract.getAllBattles();
        const pendingBattles = fetchedBattles?.filter(battle => battle.battleStatus === 0);
        let activeBattle = null;

        if (fetchedBattles) {
          fetchedBattles?.forEach(battle => {
            if (battle.players.find(player => player.toLowerCase() === address.toLowerCase())) {
              if (battle.winner.startsWith("0x00")) {
                activeBattle = battle;
              }
            }
          });
        }

        setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
      }
    };

    fetchGameData();
  }, [contract, updateGameData, battleStateChange, address, writeContracts]);

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");

      console.log("🌎 mainnetProvider", mainnetProvider);
      // console.log('🏠 localChainId', localChainId);
      // console.log('👩‍💼 selected address:', address);
      // console.log('🕵🏻‍♂️ selectedChainId:', selectedChainId);
      // console.log('💵 yourLocalBalance', yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : '...');
      // console.log('💵 yourMainnetBalance', yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : '...');
      // console.log('📝 readContracts', readContracts);
      // console.log('🌍 DAI contract on mainnet:', mainnetContracts);
      // console.log('💵 yourMainnetDAIBalance', myMainnetDAIBalance);
      // console.log('🔐 writeContracts', writeContracts);
    }
    setBattleStateChange(!battleStateChange);
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
    myMainnetDAIBalance,
    contract,
  ]);

  //* Activate event listeners for the smart contract
  useEffect(() => {
    if (step === -1 && contract) {
      createEventListeners({
        navigate,
        contract,
        injectedProvider,
        address,
        setShowAlert,
        player1Ref,
        player2Ref,
        setUpdateGameData,
      });
    }
  }, [
    step,
    contract,
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
    myMainnetDAIBalance,
    battleStateChange,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
    //automatically connect if it is a safe app
    const checkSafeApp = async () => {
      if (await web3Modal.isSafeApp()) {
        loadWeb3Modal();
      }
    };
    // checkSafeApp();
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  return (
    <Context.Provider
      value={{
        web3Modal,
        blockExplorer,
        // mainnetInfura,
        localProvider,
        mainnetProvider,
        userProviderAndSigner,
        userSigner,
        faucetAvailable,

        price,
        gasPrice,
        loadWeb3Modal,
        logoutOfWeb3Modal,
        readContracts,
        writeContracts,
        mainnetContracts,

        tx,
        contractConfig,
        yourLocalBalance,
        yourMainnetBalance,
        address,
        USE_BURNER_WALLET,
        USE_NETWORK_SELECTOR,
        NETWORKCHECK,
        setSelectedNetwork,
        networkOptions,
        selectedNetwork,
        targetNetwork,

        //custom
        gameData,
        setShowAlert,
        setErrorMessage,
        showAlert,
        errorMessage,
        setStep,
        step,
        setBattleGround,
        battleGround,
        setBattleName,
        battleName,
        contract,
        player1Ref,
        player2Ref,
        battleStateChange,
        setBattleStateChange,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StateContext;
export const useStateContext = () => useContext(Context);
