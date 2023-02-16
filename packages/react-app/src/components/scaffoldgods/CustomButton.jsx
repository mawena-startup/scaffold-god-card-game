import React from "react";

import styles from "../../styles";

const CustomButton = ({ title, handleClick, restStyles, isLoading }) => (
  <button type="button" disabled={isLoading} className={`${styles.btn} ${restStyles}`} onClick={handleClick}>
    {isLoading ? "loading..." : title}
  </button>
);

export default CustomButton;
