import './Chats.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//ensure i do error handling and loading states in production code
function Chats() {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);



    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch('http://localhost:5000/user/chats', { credentials: 'include' });
            const data = await response.json();
            setChats(data);
        };

        fetchChats();
    }, []);
    console.log(chats);
    const handleChatClick = (chatId) => {
        navigate(`/Dashboard/chatbox/${chatId}`);
    };
    if (!chats) {
        return (
            <div>
                <h2>No conversations started</h2>
            </div>

        );
    }
    else {
        return (
            <div className="chats">
                <h2>Chats</h2>

                <ul>
                    {
                        chats.map((chat) => (
                            <li key={chat._id} onClick={() => handleChatClick(chat._id)}>
                                <div className="chat-item">
                                    <h3>{chat.name}</h3>

                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        );
    }
}

export default Chats;