import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();        
  }, [post.userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/posts/${post._id}/comments`);
        if (Array.isArray(res.data)) {
          setComments(res.data);
        } else {
          setComments([]); // Asegúrate de que sea un array si la respuesta es inesperada
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [post._id]);

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
        username: user.username, // Se usa el `username` del estado `user`
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
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={post.img} alt="" />} {/* Mostrar la imagen si existe */}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
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
          {Array.isArray(comments) && comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.username}:</strong> {comment.comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}