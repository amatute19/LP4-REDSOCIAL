import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?.id));

  useEffect(() => {
    if (currentUser && user) {
      // Verifica si el usuario actual sigue al usuario en cuestión
      setFollowed(currentUser.followings.includes(user?.id));
    }
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      if (!user || !user._id) return;
      try {
        const friendList = await axios.get(`/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({type:"UNFOLLOW", payload:user._id})
      }else {
        await axios.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({type:"FOLLOW", payload:user._id});
      }
    } catch (err) {
      console.log("Error following/unfollowing user:", err);
    }
    setFollowed(!followed);
  };

  // const handleClick = async () => {
  //   try {
  //     if (followed) {
  //       await axios.put(`/users/${user._id}/unfollow`, {
  //         userId: currentUser._id,
  //       });
  //       dispatch({type:"UNFOLLOW", payload:user._id})
  //     }else {
  //       await axios.put(`/users/${user._id}/follow`, {
  //         userId: currentUser._id,
  //       });
  //       dispatch({type:"FOLLOW", payload:user._id});
  //     }
  //   } catch (err) {
  //     console.log("Error following/unfollowing user:", err);
  //   }
  //   setFollowed(!followed);
  // };


  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImg" src="assets/gift.png" alt="Gift" />
        <span className="birthdayText">
          <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
        </span>
      </div>
      <img className="rightbarAd" src="assets/ad.png" alt="Ad" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map((u) => (
          <Online key={u.id} user={u} />
        ))}
      </ul>
    </>
  );

  const ProfileRightbar = () => {
    if (!user) return <div>Loading...</div>;

    const relationshipStatus =
      user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-";

    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{relationshipStatus}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/" + friend.username} key={friend._id} style={{ textDecoration: "none" }}>
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture 
                    ? PF + friend.profilePicture 
                    : PF + "person/noAvatar.png"}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">{user ? <ProfileRightbar /> : <HomeRightbar />}</div>
    </div>
  );
}