import { Link } from "react-router-dom";
import styled from 'styled-components';
import like from "../../../images/like-icon.svg";
import dislike from "../../../images/dislike-icon.svg";
import comment from "../../../images/comment-icon.svg";
import comments from "../../../images/comments-icon.svg";

const ReactionButton = styled.button`
    background-color: white;
    display: flex;
    flex-direction: row;
    font-weight: bold;
    font-size: 1.5rem;
    border: 0;
    margin: auto 20px auto 0;
    padding: 0;
    cursor: pointer;
`

const ReactionDiv = styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
    font-weight: bold;
    font-size: 1.5rem;
    border: 0;
    margin: auto 20px auto 0;
    padding: 0;
    cursor: pointer;
`

const ImgIcon = styled.img`
    width: auto;
    height: 1.8rem;
    margin-right: 8px;
`

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
                <ReactionButton name={props.name} className={props.styling} onClick={props.onReaction}>
                    <ImgIcon className={reactionColor} src={icon} alt="" />
                    <span>{props.text}</span>
                </ReactionButton>
            );
            break;
        case "link":
            btn = (
                <Link to={props.link} className={props.styling}>
                    <ImgIcon className={reactionColor} src={icon} alt="" />
                    <span>{props.text}</span>
                </Link>
            );
            break;
        case "decor":
            btn = (
                <ReactionDiv className={props.styling}>
                    <ImgIcon className={reactionColor} src={icon} alt="" />
                    <span>{props.text}</span>
                </ReactionDiv>
            );
            break;
        default:
            console.log("erreur de bouton réaction");
    }

    return <>{btn}</>;
};

export default ReactionBtn;