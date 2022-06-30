import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";

import ReactionBtn from "../../Components/Buttons/ReactionBtn/ReactionBtn";
import UserHeader from "../UserHeader/UserHeader";
import Spinner from "../LoadingSpinner/LoadingSpinner";

import styles from "./Post.module.css";

const Post = (props) => {
    //Authentification
    const auth = useContext(AuthContext);
    //Request Hook
    const { isLoading, sendRequest } = useHttpRequest();
    //History Context
    const history = useNavigate();
    //Location
    const path = useLocation().pathname;
    //const postId = Number(useParams().id);
    //User Likes
    const [likesCounter, setLikesCounter] = useState(props.likes);
    //User Dislikes
    const [dislikesCounter, setDislikesCounter] = useState(props.dislikes);
    //UserReactions
    let [liked, setLiked] = useState(props.liked);
    let [disliked, setDisliked] = useState(props.disliked);
    
    const date = new Date(props.date);
    const datePost = date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear() + '  ' + date.getHours() + 'h'+date.getMinutes();

    let modifyDatePost;

    if (props.modifyDate != null) {
        const modifyDate = new Date(props.modifyDate);
        modifyDatePost = modifyDate.getDate()+'/' + (modifyDate.getMonth()+1) + '/'+modifyDate.getFullYear() + '  ' + modifyDate.getHours() + 'h'+modifyDate.getMinutes();
    } else {
        modifyDatePost = null;
    }
    
    //Reaction handler like
    const userLikeHandler = (event) => {
        event.preventDefault();
        if (!disliked) {
            switch (liked) {
                case true:
                    setLikesCounter(likesCounter - 1);
                    setLiked(liked = false);
                    fetch (`${process.env.REACT_APP_API_URL}/post/reaction`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
                        body: JSON.stringify({
                            posts_id: props.id
                        }),
                    })
                    .then((response) => {
                        if (response.ok) {
                            return;
                        }
                    })
                    .catch((err) => console.log(err));
                    break;
                case false:
                    setLikesCounter(likesCounter + 1);
                    setLiked(liked = true);
                    fetch (`${process.env.REACT_APP_API_URL}/post/reaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
                        body: JSON.stringify({
                            post_id: props.id,
                            reaction: 1
                        }),
                    })
                    .then((response) => {
                        if (response.ok) {
                            return;
                        }
                    })
                    .catch((err) => console.log(err));
                    break;
                default:
                    console.log("an error was produced in userlikeHandler function on post component");
                    break;
            }
        }
    };

    //Reaction handler dislike
    const userDislikeHandler = (event) => {
        event.preventDefault();
        if (!liked) {
            switch (disliked) {
                case true:
                    setDislikesCounter(dislikesCounter - 1);
                    setDisliked(disliked = false);
                    fetch (`${process.env.REACT_APP_API_URL}/post/reaction`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
                        body: JSON.stringify({
                            posts_id: props.id
                        }),
                    })
                    .then((response) => {
                        if (response.ok) {
                            return;
                        }
                    })
                    .catch((err) => console.log(err));
                    break;
                case false:
                    setDislikesCounter(dislikesCounter + 1);
                    setDisliked(disliked = true);
                    fetch (`${process.env.REACT_APP_API_URL}/post/reaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
                        body: JSON.stringify({
                            post_id: props.id,
                            reaction: -1
                        }),
                    })
                    .then((response) => {
                        if (response.ok) {
                            return;
                        }
                    })
                    .catch((err) => console.log(err));
                    break;
                default:
                    console.log("an error was produced in userDislikeHandler function on post component");
                    break;
            }
        }
    };

    //Delete post
    const DeletePostHandler = async () => {
        try {
            await sendRequest(`${process.env.REACT_APP_API_URL}/post/${props.id}`, "DELETE", null, {Authorization: "Bearer " + auth.token});
            history("/post");
            alert("Post supprimé !!!!");
        } catch (err) {}
    };

    const ModifyPostHandler = () => {
        history(`/post/update/${props.id}`);
    }
    //Type de visualisation sur Post et CommentPost
    let commentBlock;
    if(path === "/post") {
        commentBlock = (
            <>
                <ReactionBtn btnType="decor" icon="comments" text={props.comments} styling="" reaction={null} />
                <ReactionBtn btnType="link" link={props.post_link} reaction={null} icon="comment" text="commenter" styling={styles.comment_btn} />
            </>
        );
    } else {
        commentBlock = (
            <ReactionBtn btnType="decor" icon="comments" text={props.comments} styling={styles.push_right} reaction={null} />
        );
    }

    return (
        <article id={props.post_id}>
            {isLoading && (
                <div className="spinner">
                    <Spinner asOverlay />
                </div>
            )}
            <UserHeader user_id={props.user_id} post_id={props.post_id} photo_url={props.photo_url} username={props.username} date={datePost} modifyDate={modifyDatePost} onDelete={DeletePostHandler} onModify={ModifyPostHandler}/>
            <section className={styles.block}>
                {props.image_url === null ? null : (<img className={styles.photo} src={props.image_url} alt="post" />)}
                <p className={styles.title}>{props.content}</p>
                <footer className={styles.reactions}>
                    <ReactionBtn btnType="functional" name="like" onReaction={userLikeHandler} reaction={liked === true ? 1 : null} icon="like" text={likesCounter} styling="" />
                    <ReactionBtn btnType="functional" name="dislike" onReaction={userDislikeHandler} reaction={disliked === true ? -1 : null} icon="dislike" text={dislikesCounter} styling="" />
                    {commentBlock}
                </footer>
            </section>
        </article>
    );
};

export default Post;