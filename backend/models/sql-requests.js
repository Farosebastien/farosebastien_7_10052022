//Requêtes sql
exports.signup = "INSERT INTO users (firstname, lastname, username, email, role, password) VALUES (?, ?, ?, ?, 0, ?);";

exports.login = "SELECT id, email, role, password FROM users WHERE email = ?;";

exports.getUser = "SELECT firstname, lastname, username, email, role, photo_url FROM users WHERE id = ?;";

exports.updateUser = "UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, photo_url = ? WHERE id = ?;";

exports.updateUserPassword = "UPDATE users SET password = ? WHERE id = ?;";

exports.deleteUserForFile = "SELECT photo_url FROM users WHERE id = ?;";

exports.deleteUser = "DELETE FROM users WHERE id = ?;";

exports.createPost = "INSERT INTO posts (users_id, content, image_url) VALUES (?, ?, ?);";

exports.postLike = "INSERT INTO reactions (likes, users_id, posts_id) VALUES (1, ?, ?);";

exports.postDislike = "INSERT INTO reactions (dislikes, users_id, posts_id) VALUES (1, ?, ?);";

exports.postComment = "INSERT INTO comments (users_id, posts_id, content) VALUES (?, ?, ?);";

exports.getComment = "SELECT users.username, users.photo_url, comments.posts_id AS id, comments.users_id AS users_id, comments.comments_id, comments.content, comments.comment_date FROM comments INNER JOIN posts ON comments.posts_id = posts.id INNER JOIN users ON comments.users_id = users.id WHERE comments.comments_id = ?;";

exports.getPosts = "SELECT users.id AS user, username, photo_url, posts.id AS post, content, image_url, post_date, modification_date FROM users INNER JOIN posts on users.id = posts.users_id ORDER BY post_date DESC;";

exports.getCommentCount = "SELECT COUNT(*) as comments FROM comments WHERE posts_id = ?;";

exports.getLikesCount = "SELECT COUNT(likes) as likes FROM reactions WHERE posts_id = ?;";

exports.getDislikesCount = "SELECT COUNT(dislikes) as dislikes FROM reactions WHERE posts_id = ?;";

exports.getIsLiked = "SELECT likes FROM reactions WHERE posts_id = ? AND users_id = ?;";

exports.getIsDisliked = "SELECT dislikes FROM reactions WHERE posts_id = ? AND users_id = ?;";

exports.Post = "SELECT p.id AS post_id, content, users_id, username, photo_url, modification_date, post_date, image_url FROM posts AS p INNER JOIN users ON p.users_id = users.id WHERE p.id = ?;";

exports.Reactions = "SELECT (SELECT COUNT(likes) FROM reactions WHERE posts_id = r.posts_id) AS likes, (SELECT COUNT(dislikes) FROM reactions WHERE posts_id = r.posts_id) AS dislikes FROM posts AS p INNER JOIN reactions AS r ON p.id = r.posts_id INNER JOIN users AS u ON p.users_id = u.id WHERE p.id = ? GROUP BY p.id;";

exports.Comment = "SELECT users.id AS users_id, users.username, users.photo_url, comments.comments_id, comments.comment_date, comments.modification_date, comments.content FROM comments INNER JOIN users ON comments.users_id = users.id WHERE posts_id = ?;";

exports.Likers = "SELECT users.id, users.username FROM reactions INNER JOIN users ON reactions.users_id = users.id WHERE posts_id = ? AND likes = 1;";

exports.Dislikers = "SELECT users.id, users.username FROM reactions INNER JOIN users on reactions.users_id = users.id WHERE posts_id = ? AND dislikes = 1;";

exports.getOneComment = "SELECT content, users_id AS userId, comment_date, modification_date, photo_url, username FROM comments AS c INNER JOIN users ON c.users_id = users.id WHERE comments_id = ?;";

exports.updatePost = "UPDATE posts SET content = ?, image_url = ? WHERE id = ?;";

exports.updateImagePost = "UPDATE posts SET image_url = ? WHERE id = ?;";

exports.updateComment = "UPDATE comments SET content = ? WHERE comments_id = ?;";

exports.role = "SELECT role FROM users WHERE id = ?;";

exports.deleteCommentAdmin = "DELETE FROM comments WHERE comments_id = ?;";

exports.deleteCommentUser = "DELETE FROM comments WHERE comments_id = ? AND users_id = ?;";

exports.getPostImage = "SELECT image_url FROM posts WHERE id = ?;";

exports.deletePostAdmin = "DELETE FROM posts WHERE id = ?;";

exports.deletePostUser = "DELETE FROM posts WHERE id = ? AND users_id = ?;";

exports.deleteReaction = "DELETE FROM reactions WHERE posts_id = ? AND users_id = ?;";