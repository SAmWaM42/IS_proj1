import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './chatboxpage.css';
import Chatbox from '../Components/chatbox';

function ChatboxPage() {
  const { chatId } = useParams();
  const url = `http://localhost:5000/user/chats/${chatId}`;
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fetchConvo = useCallback(async () => {
    setLoaded(false);
    try {
      const info = await fetch(url, { credentials: 'include' });
      const result = await info.json();
      if (!info.ok) throw new Error(result.message || 'Failed to fetch conversation.');
      setData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaded(true);
    }
  }, [chatId, url]);

  useEffect(() => {
    fetchConvo();
  }, [url]);

  // Fallback demo data if backend fails
  const sampleChat = {
    message: [
      { sender: 'You', content: 'Hey! How’s the thrift shirt?', time: '10:00 AM' },
      { sender: 'Seller', content: 'Looks perfect, thanks for asking!', time: '10:02 AM' },
      { sender: 'You', content: 'I’ll send payment shortly.', time: '10:03 AM' },
      { sender: 'Seller', content: 'Great. Let me know once you do 😊', time: '10:04 AM' },
    ]
  };

  return loaded ? (
    <div className="chatbox-page">
      <Chatbox message={data?.message || sampleChat.message} reload={fetchConvo} />
    </div>
  ) : (
    <div className="chatbox-page"><h1>Loading chats…</h1></div>
  );
}

export default ChatboxPage;
