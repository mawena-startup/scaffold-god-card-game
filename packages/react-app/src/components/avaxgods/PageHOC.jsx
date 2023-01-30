import React from 'react';

import { logo, heroImg } from '../../assets';
import styles from '../../styles';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/StateContext';
import Alert from './Alert';
const PageHOC = (Component, title, description) => () => {
  //   let navigate = useNavigate();
  // const { showAlert } = useStateContext();
  return (
    <div className={styles.hocContainer}>
      {/* {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />} */}

      <div className={styles.hocContentBox}>
        <Link to="/">
          <img src={logo} alt="logo" className={styles.hocLogo} />
        </Link>

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
