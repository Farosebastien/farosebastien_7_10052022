import React from "react";
import { Link } from "react-router-dom";

import like from "../../../images/like-icon.svg";
import dislike from "../../../images/dislike-icon.svg";
import comment from "../../../images/comment-icon.svg";
import comments from "../../../images/comments-icon.svg";

import styles from "./ReactionBtn.module.css";

const ReactionBtn = (props) => {
    //couleur du bouton
    let reactionColor = "";

    switch (props.reaction) {
        case 1:
            reactionColor = "icon_green";
            break;
        case -1:
            reactionColor = "icon_red";
            break;
        case null:
            reactionColor = "";
            break;
        default:
            console.log("erreur de changement de couleur du bouton réaction")
    }

    //Icone à montrer
    let icon;
    switch (props.icon) {
        case "like":
            icon = like;
            break;
        case "dislike":
            icon = dislike;
            break;
        case "comment":
            icon = comment;
            break;
        case "comments":
            icon = comments;
            break;
        default:
            console.log("erreur de choix d'icone du bouton réaction");
    }
    // Type de bouton à montrer
    let btn;
    switch (props.btnType) {
        case "functional":
            btn = (
                <button name={props.name} className={`${styles.reaction_btn} ${props.styling}`} onClick={props.onReaction}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </button>
            );
            break;
        case "link":
            btn = (
                <Link to={props.link} className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </Link>
            );
            break;
        case "decor":
            btn = (
                <div className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </div>
            );
            break;
        default:
            console.log("erreur de bouton réaction");
    }

    return <>{btn}</>;
};

export default ReactionBtn;