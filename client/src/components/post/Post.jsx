import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function Post({ post }) {
  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const [user, setUser] = useState({});
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user:currentUser } = useContext(AuthContext);
  // const APIURL = process.env.API_URL;


    // Función para obtener el usuario que hizo el comentario
    const fetchUser = async (userId) => {
      try {
        const res = await axios.get(`/users?userId=${userId}`);
        return res.data.username;
      } catch (err) {
        console.log(err);
        return "Unknown User";
      }
    };


      // Función para obtener los comentarios del post
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
    // Verificar si el post está marcado como "like" por el usuario actual
    setIsLiked(post.likes.includes(currentUser._id));
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
        username: await fetchUser(currentUser._id),
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      setShowCommentForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
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
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            {/* <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            /> */}
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
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.username}:</strong> {comment.comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}