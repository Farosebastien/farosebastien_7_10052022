import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";

import GenProfile from "../../images/generic_profile_picture.jpg";

import DeleteX from "../../images/x-icon.svg";

import styles from "../../Styles/Components/UserHeader/UserHeader.css";

const UserHeader = (props) => {
    //Authentification
    const auth = useContext(AuthContext);
    //vérification si admin ou publicateur pour le bouton supprimer
    if (auth.userId === props.userId || auth.account === 1) {
        deleteBtn = (
            <button className={styles.delete_btn} onClick={props.onDelete}>
                <img className={styles.delete_icon} src={DeleteX} alt="delete_icon" />
            </button>
        );
    } else {
        deleteBtn = "";
    }

    return (
        <header className={styles.block}>
            <Link to={`/profile/${props.user_id}`}>
                <img className={styles.photo} src={props.photo_url || GenProfile} alt={`${props.username}`} />
                {props.username}
            </Link>
            <p className={styles.text}>
                <span className={styles.text_division}>{props.date}</span>
            </p>
            {deleteBtn}
        </header>
    );
};

export default UserHeader;