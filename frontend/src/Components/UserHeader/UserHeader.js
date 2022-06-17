import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";

import GenProfile from "../../images/generic_profile_picture.jpg";

import DeleteX from "../../images/x-icon.svg";
import modify from "../../images/modify-icon.svg";

import styles from "./UserHeader.module.css";

const UserHeader = (props) => {
    //Authentification
    const auth = useContext(AuthContext);
    const path = useLocation().pathname;
    let deleteBtn;
    let modifyBtn;
    //vérification si admin ou publicateur pour le bouton supprimer
    if ((auth.userId === props.user_id || auth.account === "admin") && (path !== "/post")) {
        deleteBtn = (
            <button className={styles.delete_btn} onClick={props.onDelete}>
                <img className={styles.delete_icon} src={DeleteX} alt="delete_icon" />
            </button>
        );
    } else {
        deleteBtn = "";
    }

    if ((auth.userId === props.user_id || auth.account === "admin") && (path !== "/post")) {
        modifyBtn = (
            <button className={styles.modify_btn} onClick={props.onModify}>
                <img className={styles.modify_icon} src={modify} alt="modify_icon" />
            </button>
        );
    } else {
        modifyBtn = "";
    }
    return (
        <header className={styles.block}>
            <Link to={`/user/${props.user_id}`}>
                <img className={styles.photo} src={props.photo_url || GenProfile} alt={`${props.username}`} />
                {props.username}
            </Link>
            <p className={styles.text}>
                <span className={styles.text_division}>posté le: {props.date}</span>
                {props.modifyDate === null ? null : (<span className={styles.text_division}>modifié le: {props.modifyDate}</span>)}
            </p>
            <div className={styles.buttons}>
                {modifyBtn}
                {deleteBtn}
            </div>
            
        </header>
    );
};

export default UserHeader;