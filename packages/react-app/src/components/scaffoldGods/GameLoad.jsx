import React from "react";
import { useNavigate } from "react-router-dom";

import CustomButton from "./CustomButton";

import styles from "../../styles";
import { useStateContext } from "../../context/StateContext";

const GameLoad = () => {
  const { address } = useStateContext();
  const navigate = useNavigate();

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer} `}>
      <div className={styles.gameLoadBtnBox}>
        <CustomButton title="Choose Battleground" handleClick={() => navigate("/battleground")} restStyles="mt-6" />
      </div>

      <div className={`flex-1 ${styles.flexCenter} flex-col`}>
        <h1 className={`${styles.headText} text-center`}>
          Waiting for a <br /> worthy opponent...
        </h1>
        <p className={styles.gameLoadText}>Protip: while you're waiting, choose your preferred battleground</p>

        <div className={styles.gameLoadPlayersBox}>
          <div className={`${styles.flexCenter} flex-col`}>
            <img src="/assets/player01.png" className={styles.gameLoadPlayerImg} />
            {address && <p className={styles.gameLoadPlayerText}>{address.slice(0, 20)}</p>}
          </div>

          <h2 className={styles.gameLoadVS}>Vs</h2>

          <div className={`${styles.flexCenter} flex-col`}>
            <img src="/assets/player02.png" className={styles.gameLoadPlayerImg} />
            <p className={styles.gameLoadPlayerText}>??????????</p>
          </div>
        </div>

        <div className="mt-10">
          <p className={`${styles.infoText} text-center mb-5`}>OR</p>

          <CustomButton title="Join other battles" handleClick={() => navigate("/join-battle")} />
        </div>
      </div>
    </div>
  );
};

export default GameLoad;
