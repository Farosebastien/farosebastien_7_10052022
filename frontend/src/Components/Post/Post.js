import React, { useContext, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
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
    const history = useHistory();
    //Location
    const path = props.location.pathname;
    const postId = props.location.pathname.split("/")[2];
    //User Likes
    const [likesCounter, setLikesCounter] = useState(props.likes);
    //User Dislikes
    const [dislikesCounter, setDislikesCounter] = useState(props.dislikes);
    //Liked
    const [liked, setLiked] = useState(props.liked);
    //Disliked
    const [disliked, setDisliked] = useState(props.disliked);

}