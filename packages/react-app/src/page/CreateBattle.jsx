import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles";

import { CustomButton, CustomInput, GameLoad, PageHOC } from "../components/avaxgods";
import { useStateContext } from "../context/StateContext";

const CreateBattle = () => {
  const {
    tx,
    writeContracts,

    gameData,
    battleName,
    setBattleName,
    setErrorMessage,
    isLoading,
    setIsLoading,
  } = useStateContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    setIsLoading(true);
    if (battleName === "" || battleName.trim() === "") {
      setIsLoading(false);
      return;
    }

    try {
      // await contract.createBattle(battleName);
      await tx(writeContracts.AVAXGods.createBattle(battleName), update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          setWaitBattle(true);
          setIsLoading(false);
        } else {
          setErrorMessage(update);
          setIsLoading(false);
        }
      });
    } catch (error) {
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeHolder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton title="Create Battle" handleClick={handleClick} restStyles="mt-6" isLoading={isLoading} />
      </div>
      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>,
);
