import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import UserHeader from "../UserHeader/UserHeader";

import styles from "./Comment.module.css";

const Comment = (props) => {
    //Authentification context
    const auth = useContext(AuthContext);

    const history = useNavigate();

    const { sendRequest } = useHttpRequest();

    const date = new Date(props.date);
    const datePost = date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear() + '  ' + date.getHours() + 'h'+date.getMinutes();

    let modifyDatePost;

    if (props.modifyDate != null) {
        const modifyDate = new Date(props.modifyDate);
        modifyDatePost = modifyDate.getDate()+'/' + (modifyDate.getMonth()+1) + '/'+modifyDate.getFullYear() + '  ' + modifyDate.getHours() + 'h'+modifyDate.getMinutes();
    } else {
        modifyDatePost = null;
    }

    //Request Hook
    const DeleteCommentHandler = async () => {
        try {
            await sendRequest(`${process.env.REACT_APP_API_URL}/post/comments/${props.id}`, "DELETE", null, {Authorization: "Bearer " + auth.token});
            props.onDeleteComment(props.id);
        } catch (err) {}
    };

    const updateCommentHandler = () => {
        history(`/comment/update/${props.id}`);
    }
    return (
        <div>
            <UserHeader user_id={props.user_id} photo_url={props.photo_url} username={props.username} date={datePost} modifyDate={modifyDatePost} onDelete={DeleteCommentHandler} onModify={updateCommentHandler}/>
            <div className={styles.block}>
                <p className={styles.text}>{props.content}</p>
            </div>
        </div>
    );
};

export default Comment;