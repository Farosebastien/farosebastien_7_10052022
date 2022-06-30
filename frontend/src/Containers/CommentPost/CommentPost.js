import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { useForm } from "../../Hooks/formHook";
import { AuthContext } from "../../Context/authContext";
import { MinLength, MaxLength } from "../../Utils/validators";

import send from "../../images/send-icon.svg";

import Post from "../../Components/Post/Post";
import Comment from "../../Components/Comment/Comment";
import InputField from "../../Components/InputField/InputField";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import styles from "./CommentPost.module.css";

const CommentPost = () => {
    //Authentification context
    const auth = useContext(AuthContext);
    //Post id
    const postId = useParams().id;
    //Backend Request Hook
    const { isLoading, sendRequest } = useHttpRequest();
    //Post Hook
    const [post, setPost] = useState();
    //Comment Hook
    const [comments, setComments] = useState();
    const [commentsCounter, setCommentsCounter] = useState();
    //Form useState
    const [formState, inputHandler] = useForm(
        {
            comment: {
                value: "",
                isValid: false
            },
        },
        false
    );

    //Fetch post
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await sendRequest(`${process.env.REACT_APP_API_URL}/post/${postId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token,
                });
                setPost(postData.post[0]);
                setComments(postData.post[1].comments);
                setCommentsCounter(postData.post[0].commentsCounter);
            } catch (err) {}
        };
        fetchPost();
    }, [sendRequest, setPost, auth.token, postId, setComments, setCommentsCounter]);


    //Post handler
    const postCommentHandler = async(event) => {
        event.preventDefault();
        let newCommentData;

        if(!formState.isValid) {
            return;
        }

        try {
            newCommentData = await sendRequest(`${process.env.REACT_APP_API_URL}/post/comment`, "POST", JSON.stringify({
                    post_id: Number(postId),
                    content: formState.inputs.comment.value
                }),
                {
                    "Content-type" : "application/json",
                    Authorization: "Bearer " + auth.token
                }
                
            );
        } catch (err) {}
        setComments([...comments, newCommentData.comment]);
        setCommentsCounter(commentsCounter + 1);
        inputHandler("comment", "", false);
    };

    //Delete comment handler
    const deleteCommentHandler = (deletedCommentId) => {
        const prevComments = [...comments];
        setComments(prevComments.filter((comment) => comment.comments_id !== deletedCommentId));
        setCommentsCounter(commentsCounter - 1);
        alert("Commentaire supprimé !!!!");
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
            <div className="container">
                {!isLoading && post && comments && (
                    <div className={styles.wrapper}>
                        <Post key={post.post_id} id={post.post_id} user_id={post.users_id} photo_url={post.photo_url} username={post.username} date={post.post_date} modifyDate={post.modification_date} content={post.content} image_url={post.image_url} likes={post.likes} dislikes={post.dislikes} comments={commentsCounter} liked={post.liked} disliked={post.disliked} post_link={`/post/${post.post_id}`} />
                        <section>
                            {comments.map((comment, index) => {
                                return (
                                    <Comment key={index} id={comment.comments_id} user_id={comment.users_id} photo_url={comment.photo_url} username={comment.username} date={comment.comment_date} modifyDate={comment.modification_date} content={comment.content} onDeleteComment={deleteCommentHandler} />
                                );
                            })}
                        </section>
                        <div className={styles.comment_wrap}>
                            <form className={styles.comment_form} id="comment-form" onSubmit={postCommentHandler}>
                                <InputField id="comment" className={styles.box} name="comment" type="text" placeholder="Votre commentaire" maxLength="65" element="textarea" textIsWhite="no" validators={[MinLength(2), MaxLength(65)]} errorText="Veuillez écrire un commentaire" onInput={inputHandler} initialValue="" initialValid={false} />
                            </form>
                            <button form="comment-form" className={styles.btn} type="submit">
                                <img className={styles.icon} src={send} alt="publier commentaire" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentPost;