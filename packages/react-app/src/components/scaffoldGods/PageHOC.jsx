import React from "react";

import { heroImg } from "../../assets";
import styles from "../../styles";

import Navbar from "./Navbar";

const PageHOC = (Component, title, description) => () => {
  return (
    <div className={styles.hocContainer}>
      <Navbar />
      <div className={styles.hocContentBox}>
        <div className={styles.hocBodyWrapper}>
          <div className="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          </div>

          <p className={`${styles.normalText} my-10`}>{description}</p>

          <Component />
        </div>
      </div>

      <div className="flex flex-1">
        <img src={heroImg} alt="hero-img" className="w-full xl:h-full object-cover" />
      </div>
    </div>
  );
};

export default PageHOC;
