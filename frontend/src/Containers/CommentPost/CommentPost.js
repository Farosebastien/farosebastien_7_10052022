import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { useForm } from "../../Hooks/formHook";
import { AuthContext } from "../../Context/authContext";
import { MinLength, MaxLength } from "../../Utils/validators";

import send from "../../images/send-icon.svg";

import ErrorModal from "../../Components/ErrorModal/ErrorModal";
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
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();
    //Post Hook
    const [post, setPost] = useState();
    //Comment Hook
    const [comments, setComments] = useState();
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
                const post = await sendRequest(`http://localhost:5000/post/${postId}`, "GET", null, {
                    Authorization: "Bearer " + auth.token,
                });
                setPost(post[0]);
                setComments(post[1].comments);
            } catch (err) {}
        };
        fetchPost();
    }, [sendRequest, setPost, auth.token, postId, setComments]);

    //Post handler
    const postCommentHandler = async(event) => {
        event.preventDefault();

        if(!formState.isValid) {
            return;
        }

        try {
            const newCommentData = await sendRequest(`http://localhost:5000/post/comment`, "POST", JSON.stringify({
                    postId: postId,
                    content: formState.inputs.comment.value
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            );
            setComments((prevComments) => [...prevComments, newCommentData[0]]);
            inputHandler("comment", "", false);
        } catch (err) {}
    };

    //Delete post handler
    const deletePostHandler = (deletedPostId) => {
        setPost((prevPosts) => prevPosts.filter((post) => post.post_id !== deletedPostId));
    };

    //Delete comment handler
    const deleteCommentHandler = (deletedCommentId) => {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== deletedCommentId));
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
                <ErrorModal error={error} onClear={clearError} />
                <div className={styles.container}>
                    <h2>No User Data!</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <div className="container">
                {!isLoading && post && comments && (
                    <div className={styles.wrapper}>
                        <Post key={post.post_id} id={post.post_id} user_id={post.user_id} photo_url={post.photo_url} username={post.username} date={post.date} title={post.content} image_url={post.image_url} likes={post.likes} dislikes={post.dislikes} comments={post.commentsCounter} userReaction={post.userReaction} post_link={`/post/${post.post_id}`} onDelete={deletePostHandler} />
                        <section>
                            {comments.map((comment, index) => {
                                return (
                                    <Comment key={index} id={comment.id} user_id={comment.user_id} photo_url={comment.photo_url} username={comment.username} date={comment.comment_date} content={comment.content} onDeleteComment={deleteCommentHandler} />
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