import React from "react";
import ReactDOM from "react-dom";

import styles from "../../Styles/Components/Backdrop/Backdrop.module.css";

const Backdrop = (props) => {
    //Portail
    return ReactDOM.createPortal(
        <div className={styles.backdrop} onClick={props.onClick}></div>,
        document.getElementById("backdrop-hook")
    );
};

export default Backdrop;