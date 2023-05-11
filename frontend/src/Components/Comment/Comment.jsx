import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import UserHeader from "../UserHeader/UserHeader";
import styled from 'styled-components';

const CommentBlock = styled.div`
    border-bottom: 1px solid #bdbdbd;
    margin-bottom: 16px;
    text-align: left;
`

const CommentText = styled.p`
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    margin: auto 0;
    margin-bottom: 16px;
`

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
        <>
            <UserHeader user_id={props.user_id} photo_url={props.photo_url} username={props.username} date={datePost} modifyDate={modifyDatePost} onDelete={DeleteCommentHandler} onModify={updateCommentHandler}/>
            <CommentBlock>
                <CommentText>{props.content}</CommentText>
            </CommentBlock>
        </>
    );
};

export default Comment;