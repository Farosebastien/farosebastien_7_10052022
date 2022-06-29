import React, {  useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../Hooks/formHook";
import { MinLength, MaxLength } from "../../Utils/validators";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";
import Comment from "../../Components/Comment/Comment";

import send from "../../images/send-icon.svg";

import InputField from "../../Components/InputField/InputField";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./UpdateComment.module.css"

const UpdateComment = () => {
    //Authentification contexte
    const auth = useContext(AuthContext);
    //Comment Hook
    const [comment, setComment] = useState();
    //History Hook
    const history = useNavigate();
    //Backend request hook
    const { isLoading, sendRequest } = useHttpRequest();
    //Récupération du paramètre
    const commentId = useParams().id;
    //Fomr useState
    const [formState, inputHandler] = useForm(
        {
            comment: {
                value: "",
                isValid: false
            },
        },
        false
    );

    //Fetch comment
    useEffect(() => {
        const fetchComment = async () => {
            try {
                const commentData = await sendRequest(`${process.env.REACT_APP_API_URL}/post/comments/${commentId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token
                });
                setComment(commentData.comment);
            } catch (err) {}
        };
        fetchComment();
    }, [sendRequest, commentId, auth.token]);

    //Fetch update comment
    const UpdateCommentHandler = async(event) => {
        event.preventDefault();
        if(!formState.isValid) {
            return;
        }
        try {
            await sendRequest(`${process.env.REACT_APP_API_URL}/post/comments/${commentId}`, "PUT", JSON.stringify({
                    content: formState.inputs.commentUpdate.value
                }),
                {
                    "Content-type" : "application/json",
                    Authorization: "Bearer " + auth.token
                });
        } catch (err) {}
        inputHandler("commentUpdate", "", false);
        history(-1);
        alert("Commentaire modifié !!!!");
    };

    //Abort update comment
    const abortUpdateHandler = () => {
        history(-1);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="spinner">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!comment) {
        return (
            <>
                <div className={styles.container}>
                    <h2>No Comment Data!</h2>
                </div>
            </>
        );
    }

    return (
        <>
            {!isLoading && comment && (
                <div className={styles.container}>
                    <Comment id={commentId} photo_url={comment.photo_url} username={comment.username} date={comment.comment_date} modifyDate={comment.modification_date} content={comment.content} />
                    <div className={styles.wrapper}>
                        <div className={styles.comment_wrap}>
                            <form className={styles.comment_form} id="commentUpdate-form" onSubmit={UpdateCommentHandler}>
                                <InputField id="commentUpdate" className={styles.box} name="commentUpdate" type="text" placeholder="Modifier le commentaire" maxLength="65" element="textarea" textIsWhite="no" validators={[MinLength(2), MaxLength(65)]} errorText="Veuillez écrire un commentaire" onInput={inputHandler} initialValue="" initialValid={false} />
                            </form>
                            <button form="commentUpdate-form" className={styles.btn} type="submit">
                                <img className={styles.icon} src={send} alt="mettre à jour le commentaire" title="mettre à jour le commentaire" />
                            </button>
                        </div>
                        <button className={styles.abort_btn} onClick={abortUpdateHandler}>Ne pas modifier le commentaire</button>
                    </div>
                </div>
            )}
        </>
    );
}


export default UpdateComment;