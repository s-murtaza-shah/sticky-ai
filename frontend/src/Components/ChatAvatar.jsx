import React, {useState} from "react";
import Chat from "./Chat";
import "../styles/ChatAvatar.css";

function ChatAvatar({ user }) {
    const [showChat, setShowChat] = useState(false);
    return (
        <div className="chat-avatar">
            {showChat && <Chat user={user} />}
            <img src="../../assets/bot.jpg" className="bot-img" onClick={() => setShowChat(prevVal => { return !prevVal})} />
        </div>
        
    );
}

export default ChatAvatar;