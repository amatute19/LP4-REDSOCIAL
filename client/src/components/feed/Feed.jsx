// import { useEffect, useState } from "react";
// import Share from "../share/Share";
// import "./feed.css";
// import axios from "axios";

// export default function Feed() {
//   const [posts, setPosts] = useState([]);
  
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/posts/timeline/667f1b01de9a50cbe0ca758e");
//         setPosts(res.data);
//         console.log(res.data);
//       } catch (error) {
//         if (error.response) {
//           // El servidor respondió con un estado diferente de 2xx
//           console.error('Error response:', error.response);
//           if (error.response.status === 404) {
//             console.error('Endpoint not found (404). Check the URL or server configuration.');
//           }
//         } else if (error.request) {
//           // La solicitud fue hecha pero no se recibió respuesta
//           console.error('No response received:', error.request);
//         } else {
//           // Algo más causó el error
//           console.error('Error:', error.message);
//         }
//       }
//     };
//     fetchPosts();        
//   }, []);

//   return (
//     <div className="feed">      
//       <div className="feedWrapper">
//         <Share />
//         {/* {posts.map((p) => (
//           <Post key={p.id} post={p} />
//         ))} */}
//       </div>
//     </div>
//   );
// }











import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({username}) {
  const [posts,setPosts] = useState([]);
  const {user} = useContext(AuthContext)
  

      useEffect(() => {
        const fetchPosts = async () => {
          const res = username 
            ? await axios.get("/posts/profile/" + username)
            : await axios.get("/posts/timeline/" + user._id);
          setPosts(
            res.data.sort((p1,p2)=>{
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
        };
        fetchPosts();        
        
      },[username,user._id]);

  return (
    <div className="feed">      
    
      <div className="feedWrapper">
        {username === user.username && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
