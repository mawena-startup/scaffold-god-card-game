import React, { useEffect, useState } from "react";
import { CustomButton, CustomInput, PageHOC } from "../components/avaxgods";
import { useStateContext } from "../context/StateContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    contract,
    writeContracts,
    tx,
    address,
    gameData,
    setShowAlert,
    setErrorMessage,
    battleStateChange,
    isLoading,
    setIsLoading,
  } = useStateContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const playerExists = await contract.isPlayer(address);

      if (!playerExists) {
        await tx(writeContracts.AVAXGods.registerPlayer(playerName, playerName, { gasLimit: 500000 }), update => {
          if (update && (update.status === "confirmed" || update.status === 1)) {
            setShowAlert({
              status: true,
              type: "info",
              message: `${playerName} is being summoned!`,
            });
            setIsLoading(false);
            setTimeout(() => {
              navigate("/create-battle");
            }, 5000);
          } else {
            setErrorMessage(update);
            setShowAlert({
              status: true,
              type: "failure",
              message: update?.message,
            });
            setIsLoading(false);
          }
        });
      }
    } catch (error) {
      setErrorMessage(error);

      setShowAlert({
        status: true,
        type: "failure",
        message: "something went wrong",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(address);
      const playerTokenExists = await contract.isPlayerToken(address);

      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) createPlayerToken();
  }, [contract, battleStateChange]);

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

          {address && (
            <CustomButton title="Register" handleClick={handleClick} restStyles="mt-6" isLoading={isLoading} />
          )}
        </div>
      )}
    </>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Scaffold Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game
  </>,
);
