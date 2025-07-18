import './chatbox.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from './ContextWrapper.js';

function Message({ data, isSender }) {
    return (
        <div className={`message ${isSender ? 'sender' : 'receiver'}`}>
            <p>{data.text}</p>
            <p className="timestamp">{data.timestamp}</p>
        </div>
    );
}

function Chatbox({ message, reload }) {
    const [input, setInput] = useState('');
    const contextData = useContext(GlobalContext);
    const { myData } = contextData || {};
    const navigate = useNavigate();
    const { chatId } = useParams();

    console.log(message);
    const hasMessages = message.length > 0;

    const handleSend = async (event) => {
        event.preventDefault();
        if (input.trim()) {
            console.log('Sending message:', input);
            try {
                const url = `http://localhost:5000/user/chats/${chatId}`;
                const response = await fetch(url, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: input }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Message not sent successfully.");
                }
                console.log('Message sent successfully!');
                setInput('');
                if (reload) {
                    console.log("reloading");
                    reload();
                }
            } catch (err) {
                console.error("Error sending message:", err);
            }
        }
    };

    return (
        <div className="chatbox">
            {hasMessages ? (
                <div className="messages">
                    {message.map((msg) => (
                        <Message
                            key={msg._id}
                            data={msg}
                            isSender={msg.SenderId === myData._id}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    <h1>New Chat</h1>
                </div>
            )}
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default Chatbox;

