import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like,setLike] = useState(post.likes.length);
  const [isLiked,setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isReported, setIsReported] = useState(false); // Track if the post is reported
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user:currentUser } = useContext(AuthContext);

  const fetchUser = async (userId) => {
    try {
      const res = await axios.get(`/users?userId=${userId}`);
      return res.data.username;
    } catch (err) {
      console.log(err);
      return "Unknown User";
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`/posts/${post._id}/comments`);
      const commentsWithUsernames = await Promise.all(
        res.data.map(async (comment) => {
          const username = await fetchUser(comment.userId);
          return { ...comment, username };
        })
      );
      setComments(commentsWithUsernames);
    } catch (err) {
      console.log(err);
    }
  }, [post._id]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
    setIsReported(post.reports?.includes(currentUser._id)); // Check if the post is already reported
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  },[post.userId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentClick = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/posts/${post._id}/comment`, {
        userId: currentUser._id,
        comment,
      });
      const newComment = {
        ...res.data,
        username: currentUser.username, // Usar `currentUser.username`
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      setShowCommentForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleReportPost = async () => {
    if (isReported) {
      return; // If already reported, do nothing
    }
    try {
      await axios.post(`/posts/${post._id}/report`, {
        userId: currentUser._id,
      });
      setIsReported(true); // Update state to indicate the post has been reported
    } catch (err) {
      console.error("Error reporting post:", err);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
            {!isReported ? (
              <button className="reportButton" onClick={handleReportPost}>
                Reportar Post
              </button>
            ) : (
              <div className="alreadyReportedMessage">
                Has reportado el Post
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={post.img} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight" onClick={handleCommentClick}>
            <span className="postCommentText">{comments.length} comments</span>
          </div>
        </div>
        {showCommentForm && (
          <form className="commentForm" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Escribir un comentario ..."
              value={comment}
              onChange={handleCommentChange}
            />
            <button type="submit">Enviar</button>
          </form>
        )}
        <div className="comments">
          {Array.isArray(comments) && 
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.username}:</strong> {comment.comment}
              </div>
            ))}
        </div>
        {isReported && <div className="reportMessage">Post ha sido reportado.</div>}
      </div>
    </div>
  );
}
