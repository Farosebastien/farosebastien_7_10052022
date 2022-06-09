import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { AuthContext } from "../../Context/authContext";

import ReactionBtn from "../../Components/Buttons/ReactionBtn";
import UserHeader from "../UserHeader/UserHeader";
import Spinner from "../LoadingSpinner/LoadingSpinner";

import styles from "../../Styles/Components/Post/Post.css";

const Post = (props) => {
    //Authentification
    const auth = useContext(AuthContext);
    //Request Hook
    const { isLoading, sendRequest } = useHttpRequest();
    //History Context
    const history = useNavigate();
    //Location
    const path = props.location.pathname;
    const postId = props.location.pathname.split("/")[2];
    //User Likes
    const [likesCounter, setLikesCounter] = useState(props.likes);
    //User Dislikes
    const [dislikesCounter, setDislikesCounter] = useState(props.dislikes);
    //UserReaction
    const [userReaction, setUserReaction] = useState(props.userReaction);
    //Liked
    const [liked, setLiked] = useState(props.liked);
    //Disliked
    const [disliked, setDisliked] = useState(props.disliked);

    //Réaction handler
    const userReactionHandler = (event) => {
        event.preventDefault();
        let reaction;
        switch (userReaction) {
            case null:
                if (event.currentTarget.name === 1) {
                    setLikesCounter(likesCounter + 1);
                    reaction = event.currentTarget.name;
                } else {
                    setDislikesCounter(dislikesCounter + 1);
                    reaction = event.currentTarget.name;
                }
                setUserReaction(event.currentTarget.name);
                setLiked(true);
                setDisliked(true);
                break;
            case "null":
                if (event.currentTarget.name === 1) {
                    setLikesCounter(likesCounter + 1);
                    reaction = event.currentTarget.name;
                } else {
                    setDislikesCounter(dislikesCounter + 1);
                    reaction = event.currentTarget.name;
                }
                setUserReaction(event.currentTarget.name);
                break;
            case 1:
                if (event.currentTarget.name === 1) {
                    setLikesCounter(likesCounter - 1);
                    setUserReaction("null");
                    reaction = "null";
                } else {
                    setLikesCounter(likesCounter - 1);
                    setDislikesCounter(dislikesCounter + 1);
                    setUserReaction(event.currentTarget.name);
                    reaction = event.currentTarget.name;
                }
                break;
            case -1:
                if (event.currentTarget.name === -1) {
                    setDislikesCounter(dislikesCounter - 1);
                    setUserReaction("null");
                    reaction = "null";
                } else {
                    setLikesCounter(likesCounter + 1);
                    setDislikesCounter(dislikesCounter - 1);
                    setUserReaction(event.currentTarget.name);
                    reaction = event.currentTarget.name;
                }
                break;
            default:
                console.log("an error was produced in userReactionHandler function on post component");
                break;
        }

        fetch (`http://localhost:3000/post/reaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({
                post_id: props.id,
                reaction: reaction
            }),
        })
        .then((response) => {
            if (response.ok) {
                return;
            }
        })
        .catch((err) => console.log(err));
    };

    //Delete post
    const DeletePostHandler = async () => {
        try {
            await sendRequest(`http://localhost:3000/post/${props.id}`, "DELETE",
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            );
            if (path === `/post/${postId}`) {
                history("/post");
            } else {
                props.onDelete(props.id);
            }
        } catch (err) {}
    };
    //Type de visualisation sur Post et CommentPost
    let commentBlock;
    if(props.location.pathname === "/post") {
        commentBlock = (
            <>
                <ReactionBtn btnType="decor" icon="commments" text={props.comments} styling="" reaction={null} />
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
            <UserHeader user_id={props.user_id} photo_url={props.photo_url} username={props.username} date={props.post_date} onDelete={DeletePostHandler} />
            <section className={styles.block}>
                <h3 className={styles.title}>{props.content}</h3>
                <img className={styles.photo} src={props.image_url} alt="post" />
                <footer className={styles.reactions}>
                    <ReactionBtn btnType="functionnal" name="like" onReaction={userReactionHandler} reaction={liked === true ? 1 : null} icon="like" text={likesCounter} styling="" />
                    <ReactionBtn btnType="functionnal" name="dislike" onReaction={userReactionHandler} reaction={disliked === true ? -1 : null} icon="dislike" text={dislikesCounter} styling="" />
                    {commentBlock}
                </footer>
            </section>
        </article>
    );
};

export default Post;