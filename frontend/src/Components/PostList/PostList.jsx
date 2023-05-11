import Post from "../Post/Post";
import styled from "styled-components";

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 77.4vh;
    overflow-y: scroll;
    background-color: #ffd7d7;
    border-radius: 0 0 5rem 5rem;
    padding: 0 2rem;
`

const PostList = (props) => {
    if (props.items.posts.length === 0) {
        return (
            <PostContainer>
                <h2>Pas de Posts !!</h2>
            </PostContainer>
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