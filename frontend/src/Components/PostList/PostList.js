import React from "react";
import Post from "../Post/Post";

import styles from "./PostList.module.css";

const PostList = (props) => {
    if (props.items.posts.length === 0) {
        return (
            <div className={styles.container}>
                <h2>Pas de Posts !!</h2>
            </div>
        );
    }

    return (
        <>
            {props.items.posts.map((post) => {
                return (
                    <Post key={post.post} id={post.post} user_id={post.user} photo_url={post.photo_url} username={post.username} date={post.post_date} modifyDate={post.modification_date} content={post.content} image_url={post.image_url} likes={post.likes} dislikes={post.dislikes} comments={post.commentsCounter} liked={post.liked} disliked={post.disliked} post_link={`/post/${post.post}`} onDelete={props.onDeletePost} />
                );
            })}
        </>
    );
};

export default PostList;