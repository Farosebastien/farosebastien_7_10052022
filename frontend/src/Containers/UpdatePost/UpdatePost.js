import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useForm } from "../../Hooks/formHook";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { MinLength, MaxLength } from "../../Utils/validators";

import send from "../../images/send-icon.svg";

import Post from "../../Components/Post/Post";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import InputField from "../../Components/InputField/InputField";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./UpdatePost.module.css"


const UpdatePost = () => {
    //Authentification
    const auth = useContext(AuthContext);
    //History
    const history = useNavigate();
    //Récupération de l'id du post
    const postId = useParams().id
    //Post state
    const [post, setPost] = useState();
    //Request Hook
    const { isLoading, sendRequest } = useHttpRequest();
    //FormState
    const [formState, inputHandler] = useForm(
        {
            title: {
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

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const postData = await sendRequest(`${process.env.REACT_APP_API_URL}/post/${postId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token
                });
                setPost(postData.post[0]);
            } catch (err) {}
        };
        fetchComment();
    }, [sendRequest, postId, auth.token]);

    //Fetch update comment
    const UpdatePostHandler = async(event) => {
        event.preventDefault();
        if(!formState.isValid) {
            return;
        }
        const formData = new FormData();
        formData.append("content", formState.inputs.title.value);
        formData.append("image", formState.inputs.image.value);
        try {
            await sendRequest(`${process.env.REACT_APP_API_URL}/post/${postId}`, "PUT", formData,
                {
                    Authorization: "Bearer " + auth.token
                });
        } catch (err) {}
        history(-1);
        alert("Publication modifiée !!!!");
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

    if (!post) {
        return (
            <>
                <div className={styles.container}>
                    <h2>No Post Data!</h2>
                </div>
            </>
        );
    }

    return (
        <>
            {!isLoading && post && (
                <div className={styles.container}>
                    <Post id={postId} image_url={post.image_url} post_id={post.post_id} user_id={post.users_id} photo_url={post.photo_url} username={post.username} date={post.post_date} modifyDate={post.modification_date} content={post.content} likes={post.likes} dislikes={post.dislikes} comments={post.commentsCounter} liked={post.liked} disliked={post.disliked} />
                    <div className={styles.wrapper}>
                        <div className={styles.post_wrap}>
                            <form className={styles.post_form} id="commentUpdate-form" onSubmit={UpdatePostHandler}>
                                <ImageUpload center id="image" onInput={inputHandler} errorText="Choississez une image" post_id={post.post_id} />
                                <InputField id="title" className={styles.box} name="title" type="text" placeholder="Modifier la publication" maxLength="150" element="textarea" textIsWhite="no" validators={[MinLength(2), MaxLength(150)]} errorText="Veuillez écrire quelque-chose" onInput={inputHandler} initialValue="" initialValid={false} />
                            </form>
                            <button form="commentUpdate-form" className={styles.btn} type="submit">
                                <img className={styles.icon} src={send} alt="mettre à jour la publication" title="mettre à jour la publication" />
                            </button>
                        </div>
                        <button className={styles.abort_btn} onClick={abortUpdateHandler} alt="Annuler">Ne pas modifier la publication</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdatePost