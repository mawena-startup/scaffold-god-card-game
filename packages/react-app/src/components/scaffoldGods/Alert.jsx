import React from "react";

import AlertIcon from "./AlertIcon.jsx";
import styles from "../../styles";

const Alert = ({ type, message }) => (
  <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
    <div className={`${styles.alertWrapper} ${styles[type]}`} role="alert">
      <AlertIcon type={type} /> {message}
    </div>
  </div>
);

export default Alert;
