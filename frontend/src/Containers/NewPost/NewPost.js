import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useForm } from "../../Hooks/formHook";
import { useWindowDimension } from "./../../Hooks/windowHook";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { MinLength, MaxLength } from "../../Utils/validators";

import backIcon from "../../images/back-icon.svg";

import UIBtn from "../../Components/Buttons/UIBtn/UIBtn";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import InputField from "../../Components/InputField/InputField";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./NewPost.module.css";

const NewPost = (props) => {
    //Authentification
    const auth = useContext(AuthContext);
    //History
    const history = useNavigate();
    const { isLoading, sendRequest } = useHttpRequest();
    //Window Size
    const { width } = useWindowDimension();
    //FormState
    const [formState, inputHandler] = useForm(
        {
            content: {
                value: "",
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    );

    //Envoi du post au backend
    const sendPostHandler = async (event) => {
        event.preventDefault();

        if(!formState.isValid) {
            return;
        }

        const formData = new FormData();
        formData.append("content", formState.inputs.title.value);
        formData.append("image", formState.inputs.image.value);

        try {
            await sendRequest(`${process.env.REACT_APP_API_URL}/post`, "POST", formData, {
                Authorization: "Bearer " + auth.token
            });
            history("/post");
        } catch (err) {}
    };

    //Bouton retour
    const backHandle = (e) => {
        e.preventDefault();
        history("/post");
    };

    //Boutons
    let sendBtn;
    let backBtn;

    if (width >= 1024) {
        sendBtn = (
            <div className={styles.send_btn}>
                <UIBtn id="send-post-btn" form="send-post-form" name="Publier" type="submit" btnType="valid" />
            </div>
        );
        backBtn = (
            <button className={styles.back_btn} onClick={backHandle}>
                <img className="icon_red" src={backIcon} alt="" />
            </button>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="spinner">
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <>
            {!isLoading && (
                <>
                    <header className={styles.head}>
                        <div className={styles.tab}>
                            {backBtn}
                            <div className={styles.tab_border}>
                                <h3 className={styles.title}>Nouvelle Publication</h3>
                            </div>
                        </div>
                    </header>
                    <div className="container">
                        <form className={styles.form} id="send-post-form" onSubmit={sendPostHandler}>
                            <ImageUpload center id="image" onInput={inputHandler} errorText="Choississez une image" />
                            <InputField id="title" name="title" type="text" placeholder="Contenu de la publication" maxLength="100" element="textarea" hasLabel="no" textIsWhite="no" validators={[MinLength(2), MaxLength(100)]} errorText="Veuillez écrire un commentaire pour votre publication" onInput={inputHandler} initialValue={formState.inputs.content.value} initialValid={formState.inputs.content.isValid} />
                            {sendBtn}
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default NewPost;