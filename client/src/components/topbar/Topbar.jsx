import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // State to store notifications count

  const handleLogout = () => {
    // Limpiar el contexto de autenticación
    dispatch({ type: "LOGOUT" });
    // Redirigir a la página de registro
    navigate("/register");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim()) {
        try {
          const res = await axios.get(`/users/search?q=${searchTerm}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await axios.get(`/notifications/${user._id}`);
        // Count the unread notifications
        const unreadCount = res.data.filter(notification => !notification.isRead).length;
        setNotificationCount(unreadCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotificationCount();
  }, [user._id]);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">PhotoFUSION</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend."
            className="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="searchResults">
              {searchResults.map((user) => (
                <Link to={`/profile/${user.username}`} key={user._id} style={{ textDecoration: "none", color: "black" }}>
                  <li className="searchResultItem">{user.username}</li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Link to={`/dashboard`} key={user._id}>
                <Notifications />
            </Link>
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <button className="topbarLogoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
