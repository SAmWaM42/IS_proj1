
import './chatbox.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Message({ data }) {
    return (
        <div className="message">
            <p>{data.text}</p>
            <p>{data.timestamp}</p>

        </div>
    );
}

function Chatbox({ messages}) {
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const { chatId } = useParams(); // Assuming the URL contains a parameter for the chat ID or user ID
   
    const handleSend = async () => {
        if (input.trim()) {
            // Here you would typically send the message to the server
            console.log('Sending message:', input);
            const url = `http://localhost:5000/user/chats/${chatId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: input }),

            });
        }
    };

        return (
            <div className="chatbox">
                <div className="messages">
                    {messages.map((msg) => (
                        <Message key={msg._id} data={msg} />
                    ))}
                </div>
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
