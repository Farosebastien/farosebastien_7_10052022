import React, { useState, useEffect, useContext } from  "react";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { useWindowDimension } from "../../Hooks/windowHook";
import TabBtn from "../../Components/Buttons/TabBtn/TabBtn";
import PostList from "../../Components/PostList/PostList";
import Spinner from "../../Components/LoadingSpinner/LoadingSpinner";

import clockIcon from "../../images/clock-icon.svg";
import coffeeIcon from "../../images/coffee-icon.svg";
import postIcon from "../../images/post-icon.svg";

import styles from "./Posts.module.css";

const Posts = () => {
    //auth context
    const auth = useContext(AuthContext);
    //Window size
    const { width } = useWindowDimension();
    //Request Hook
    const { isLoading, sendRequest } = useHttpRequest();
    //Post state
    const [posts, setPosts] = useState();
    const [activeBtn, setActiveBtn] = useState({
        mostRecents: "active",
        mostLiked: ""
    });
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/post`, "GET", null, {
                    Authorization: "Bearer " + auth.token
                });
                setPosts(postsData);
            } catch (err) {}
        };
        fetchPosts();
    }, [sendRequest, auth.token]);

    const fetchMostRecent = async () => {
        setActiveBtn({
            mostRecents: "active",
            mostLiked: "",
        });
        try {
            const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/post`, "GET", null, {
                Authorization: "Bearer " + auth.token
            });
            setPosts(postsData);
        } catch (err) {}
    };

    const fetchMostLiked = async () => {
        setActiveBtn({
            mostRecents: "",
            mostLiked: "active",
        });
        try {
            const postsData = await sendRequest(`${process.env.REACT_APP_API_URL}/post/mostLiked`, "GET", null, {
                Authorization: "Bearer " + auth.token
            });
            setPosts(postsData);
        } catch (err) {}
    };

    let newPost;
    if (width >= 1024) {
        newPost = (
            <Link to={"/post/new"} className={styles.btn}>
                <span className={styles.text}>Nouveau post</span>
                <img className={styles.icon} src={postIcon} alt="" />
            </Link>
        );
    }

    return (
        <>
            <nav className={styles.header}>
                <TabBtn name="Les plus récents" icon={clockIcon} active={activeBtn.mostRecents} onClick={fetchMostRecent} />
                <TabBtn name="Les plus aimés" icon={coffeeIcon} active={activeBtn.mostLiked} onClick={fetchMostLiked} />
                {newPost}
            </nav>
            <div className="container">
                {isLoading && (
                    <div className="spinner">
                        <Spinner />
                    </div>
                )}
                {!isLoading && activeBtn && posts && <PostList items={posts} />}
            </div>
        </>
    );
};

export default Posts;