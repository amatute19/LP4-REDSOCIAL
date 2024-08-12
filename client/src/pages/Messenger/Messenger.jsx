import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    let isMounted = true;
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      if (isMounted) {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender)) {
      if (isMounted) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    let isMounted = true;
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      if (isMounted) {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      }
    });

    // Cleanup function
    return () => {
      socket.current.off("getUsers");
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        if (isMounted) {
          setConversations(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user._id]);

  useEffect(() => {
    let isMounted = true;
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        if (isMounted) {
          setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
