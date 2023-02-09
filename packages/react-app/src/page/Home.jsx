import React, { useEffect, useState } from "react";
import { CustomButton, CustomInput, PageHOC } from "../components/avaxgods";
import { useStateContext } from "../context/StateContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { contract, address, gameData, setShowAlert, setErrorMessage, readContracts, tx, writeContracts } =
    useStateContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(address);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });

        setTimeout(() => navigate("/create-battle"), 8000);
      }
      // await tx(writeContracts.AVAXGods.registerPlayer(playerName, playerName, { gasLimit: 500000 }));
      // navigate('/create-battle');
    } catch (error) {
      console.log(error);
      setErrorMessage(error);

      setShowAlert({
        status: true,
        type: "failure",
        message: "something went wrong",
      });
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(address);
      const playerTokenExists = await contract.isPlayerToken(address);

      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) createPlayerToken();
  }, [contract]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <>
      {address && (
        <div className="flex flex-col">
          <CustomInput
            label="Name"
            placeHolder="Enter your player name"
            value={playerName}
            handleValueChange={setPlayerName}
          />

          <CustomButton title="Register" handleClick={handleClick} restStyles="mt-6" />
        </div>
      )}
    </>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game
  </>,
);
