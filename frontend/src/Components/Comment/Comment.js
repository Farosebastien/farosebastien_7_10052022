import React from "react";
import { AuthContext } from "../../Context/authContext";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import UserHeader from "../UserHeader/UserHeader";

import styles from "../../Styles/Components/Comment/Comment.css";

const Comment = (props) => {
    //Authentification context
    const auth = useContext(AuthContext);

    //Request Hook
    const DeleteCommentHandler = async () => {
        try {
            await sendRequest(`http://localhost:3000/post/comments/${props.id}`, "DELETE", null, {
                Authorization: "Bearer " + auth.token,
            });
            props.onDeleteComment(props.id);
        } catch (err) {}
    };
    return (
        <div>
            <UserHeader user_id={props.user_id} photo_url={props.photo_url} username={props.username} date={props.date} onDelete={DeleteCommentHandler} />
            <div className={styles.block}>
                <p className={styles.text}>{props.content}</p>
            </div>
        </div>
    );
};

export default Comment;