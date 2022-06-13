import React from "react";
import { Link } from "react-router-dom";

import styles from "./NavBtn.module.css";

const NavBtn = (props) => {
    return (
        <Link to={props.link} className={props.btnStyle || styles.btn}>
           <img className={`${styles.icon} ${props.iconColor}`} src={props.icon} alt="" />
           <span className={props.textStyle || styles.text}>{props.name}</span> 
        </Link>
    );
};

export default NavBtn;