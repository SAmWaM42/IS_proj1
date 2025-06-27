import React, { useState, useEffect,useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './chatboxpage.css';
import Chatbox from '../Components/chatbox';




function ChatboxPage() {
    const { chatId } = useParams();
    const url = `http://localhost:5000/user/chats/${chatId}`;
    const [data, setdata] = useState(null);
    const [loaded, setLoaded] = useState(false);


    const fetchConvo = useCallback(async () => {

        
            setLoaded(false); // Reset loaded state at the start of fetch
          


            try {
                const info = await fetch(url, { credentials: 'include' });
                const result = await info.json();
                if (!info.ok) {
                    // If server responded with an error status (e.g., 404, 500)
                    throw new Error(result.message || 'Failed to fetch conversation.');
                }
                setdata(result);
           


            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoaded(true);
            }
        
        


    },[chatId, url])
    useEffect(()=>{ fetchConvo()},[url])

  

    return (

        loaded ? (
            <div className="chatbox-page">


                 <Chatbox message={data.message} reload={fetchConvo} />
            </div>
        ) :
            (
                <div>
                    <h1>Loading chats</h1>
                </div>

            )

    )


}


export default ChatboxPage;