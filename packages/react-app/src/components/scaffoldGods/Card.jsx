import React from "react";
import Tilt from "react-parallax-tilt";

import styles from "../../styles";

const allCards = [
  "/assets/Ace.png",
  "/assets/Bakezori.png",
  "/assets/Black_Solus.png",
  "/assets/Calligrapher.png",
  "/assets/Chakri_Avatar.png",
  "/assets/Coalfist.png",
  "/assets/Desolator.png",
  "/assets/Dusk_Rigger.png",
  "/assets/Flamewreath.png",
  "/assets/Furiosa.png",
  "/assets/Geomancer.png",
  "/assets/Gore_Horn.png",
  "/assets/Heartseeker.png",
  "/assets/Jade_Monk.png",
  "/assets/Kaido_Expert.png",
  "/assets/Katara.png",
  "/assets/Ki_Beholder.png",
  "/assets/Kindling.png",
  "/assets/Lantern_Fox.png",
  "/assets/Mizuchi.png",
  "/assets/Orizuru.png",
  "/assets/Scarlet_Viper.png",
  "/assets/Storm_Kage.png",
  "/assets/Suzumebachi.png",
  "/assets/Tusk_Boar.png",
  "/assets/Twilight_Fox.png",
  "/assets/Void_Talon.png",
  "/assets/Whiplash.png",
  "/assets/Widowmaker.png",
  "/assets/Xho.png",
];
const generateRandomCardImage = () => allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();
const Card = ({ card, title, restStyles, cardRef, playerTwo }) => (
  <Tilt>
    <div ref={cardRef} className={`${styles.cardContainer} ${restStyles}`}>
      <img src={playerTwo ? img2 : img1} alt="ace_card" className={styles.cardImg} />

      <div className={`${styles.cardPointContainer} sm:left-[21.2%] left-[22%] ${styles.flexCenter}`}>
        <p className={`${styles.cardPoint} text-yellow-400`}>{card.att}</p>
      </div>
      <div className={`${styles.cardPointContainer} sm:right-[14.2%] right-[15%] ${styles.flexCenter}`}>
        <p className={`${styles.cardPoint} text-red-700`}>{card.def}</p>
      </div>

      <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
        <p className={styles.cardText}>{title}</p>
      </div>
    </div>
  </Tilt>
);

export default Card;
