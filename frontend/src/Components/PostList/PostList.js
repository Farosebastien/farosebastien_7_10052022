import React from "react";
import Post from "../Post/Post";

import styles from "../../Styles/Components/PostList/PostList.module.css";

const PostList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className={styles.container}>
                <h2>Pas de Posts !!</h2>
            </div>
        );
    }

    return (
        <>
            {props.items.map((post) => {
                return (
                    <Post key={post.post_id} id={post.post_id} user_id={post.user_id} photo_url={post.photo_url} username={post.username} date={post.date} content={post.content} image_url={post.image_url} likes={post.likes} dislikes={post.dislikes} comments={post.comments} userReaction={post.userReaction} post_link={`/post/${post.post_id}`} onDelete={props.onDeletePost} />
                );
            })}
        </>
    );
};

export default PostList;