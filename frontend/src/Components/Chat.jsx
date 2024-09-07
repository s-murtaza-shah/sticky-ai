import React, { useState } from "react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai'; 

function Chat({ user }) {
    
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    const [processing, setProcessing] = useState(false);
    const [messages, setMessages] = useState([{
        message: "Hello, I am Henry, your AI notes assistant! How may I help you today?",
        sender: "Gemini",
        direction: "incoming"
    }]);

    async function getNotesString() {
        let notes = "";
        const res = await axios.get(`http://localhost:4000/notes/user/${user.id}`);
        res.data.forEach((noteItem) => {
            notes += (noteItem.title + ": " + noteItem.content + "\n\n");
        })
        return notes;
    }

    const handleMessageSend = async (message) => {
        const userMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        };
        const newMessages = [...messages, userMessage]
        setMessages(newMessages);
        const userNotes = await getNotesString();
        console.log(userNotes);
        var sendToBot = "You are Henry, an assistant to a person named " + user.fullname + 
                        ", you are supposed to help this person with their notes/ tasks. Here are their notes/ tasks:\n" + userNotes + 
                        "\nThey will ask you questions about their notes or any other general question related to productivity, goals, etc. Answer them to the best of your ability. Here is their question/ message: " + message;
        setProcessing(true);
        const result = await chat.sendMessage(sendToBot);
        const response =  result.response.text();
        const botMessage = {
            message: response,
            sender: "Gemini",
            direction: "incoming"
        };
        setMessages([...newMessages, botMessage]);
        setProcessing(false);
    }

    return (
        <div>
            <div style={{position: "fixed", bottom: 95, right: 25, height: "500px", width: "400px", border: "solid 4px silver" }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList typingIndicator={processing ? <TypingIndicator content="Henry is typing" /> : null } >
                            {messages.map((message, i) => {
                                return <Message key={i} model={message} />
                            })}
                        </MessageList>
                        <MessageInput placeholder="Type message here..." onSend={handleMessageSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Chat;