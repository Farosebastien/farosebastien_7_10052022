import React, { useState, useEffect, useContext } from  "react";
import { AuthContext } from "../../Context/authContext";
import { Link } from "react-router-dom";
import { useHttpRequest } from "../../Hooks/httpRequestHook";
import { useWindowDimension } from "../../Hooks/windowHook";
import ErrorModal from "../../Components/ErrorModal/ErrorModal"
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
    const { isLoading, error, sendRequest, clearError } = useHttpRequest();
    //Post state
    const [posts, setPosts] = useState();
    const [activeBtn, setActiveBtn] = useState({
        mostRecents: "active",
        mostLiked: ""
    });
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await sendRequest("http://localhost:5000/post", "GET", null, {
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
            const postsData = await sendRequest("http://localhost:5000/post", "GET", null, {
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
            const postsData = await sendRequest("http://localhost:5000/post/mostLiked", "GET", null, {
                Authorization: "Bearer " + auth.token
            });
            setPosts(postsData);
        } catch (err) {}
    };

    const deletePostHandler = (deletedPostId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== deletedPostId));
    };

    let newPost;
    if (width >= 1024) {
        newPost = (
            <Link to={"post/new"} className={styles.btn}>
                <span className={styles.text}>Nouveau post</span>
                <img className={styles.icon} src={postIcon} alt="" />
            </Link>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
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
                {!isLoading && activeBtn && posts && <PostList items={posts} onDeletePost={deletePostHandler} />}
            </div>
        </>
    );
};

export default Posts;