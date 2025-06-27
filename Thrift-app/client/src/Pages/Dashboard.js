
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams , useLocation,useNavigate } from 'react-router-dom';

import Form from '../Components/Form'
import Navbar from '../Components/Navbar';
import Chats from '../Components/Chats';
import ChatboxPage from './chatboxpage';


function Dashboard() {

    const url='http://localhost:5000/user/me'
    const location=useLocation();
    const pathSeg=location.pathname.split('/').filter(segment=>segment!=='');
    const currentRoute=pathSeg[1];
    const isMyDashboard=location.pathname === '/Dashboard';
    const {userId} = useParams(); // ID from the URL (e.g., /profile/abc123)
    const[me,setme]  = useState(null);
    const [notme,setNotme]=useState(null);
    const[loadedMe,setloadedMe]=useState(false);
    const[loadedNotMe,setloadedNotMe]=useState(false);
    const[isCreatingChat,setIsCreatingChat]=useState(null);
    const navigate=useNavigate();





      var isMyProfile = loadedMe && me && (me._id.toString() === userId||!userId);
    useEffect(()=>
    {
        const getme=async ()=>
        {
            try{
           const mydata = await fetch(url, {
    credentials: 'include', // <-- You need this!
});
        if(!mydata.ok)
        {
            {
                    const errorData = await mydata.json();
                    throw new Error(errorData.message || 'Failed to fetch self');
              }
        }

          const validdata= await  mydata.json();
          setme(validdata);
          setloadedMe(true);
    }catch(err)
    {
        console.log(err);
    }

};
      if(!loadedMe)
      {
        getme();
      }

    },[])



const altUrl=`http://localhost:5000/user/${userId}`;

        useEffect(()=>
    {
        const getnotme=async ()=>
        {
            try{
                if(userId)
                {
           const mydata = await fetch(altUrl, {
    credentials: 'include', // <-- You need this!
});
        if(!mydata.ok)
        {
            {
                    const errorData = await mydata.json();
                    throw new Error(errorData.message || 'Failed to fetch self');
              }
        }

          const validdata= await  mydata.json();
          setNotme(validdata);
          setloadedNotMe(true);
    }
    }catch(err)
    {
        console.log(err);
    }

};
        getnotme();
      

    },[userId])

    const startChat= async ()=>
    {
        setIsCreatingChat(true);
        try
        {    
            const response=await fetch('http://localhost:5000/user/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for sending cookies/session
                body: JSON.stringify({
                    otherUser: notme._id // The ID of the profile currently being viewed
                })
            });
              const data=await response.json();
              if(!response.ok)
              {
                throw new Error(data.message || 'Failed to create or get chat.');
              }

              navigate(`/dashboard/chatbox/${data.chatId}`)


        }
        catch( err)
        {   console.error("Error starting chat:", err);
         
        }
        finally 
        {
          setIsCreatingChat(false);  
        }
    }
 
   

   
  
    const button_data =
    {
        className: 'Upload-button',
        type: 'submit',
        label: 'Upload',

    }
    const formdata = [

        { label: 'name', type: 'text', name: 'name', key: 'name' },
        { label: 'description', type: 'text', name: 'description', key: 'description' },
        { label: 'price', type: 'number', name: 'price', key: 'price' },
        { label: 'Image', type: 'file', name: 'image', key: 'image' }

    ];
     const dash_nav_elements = [
        //modify this to add more elements to the navbar
       
        { key: 'AddProduct', Label: 'AddProduct', destination: '/Dashboard/AddProduct' },
        { key: 'Chats', Label: 'Chats', destination: '/Dashboard/Chats' },
      


    ];

    const dest_url = 'product';

if((!userId||isMyDashboard)&&!loadedNotMe)
    {
      
       setloadedNotMe(true);
      
    }
   

if (!loadedMe||!loadedNotMe) {
        return <div>Loading your profile status...</div>;
    }

  
        const renprofile=()=>
        {
            switch(currentRoute)
            {
                case 'AddProduct':
                    return (
                          <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
                    );
                case 'Chats':
                    return(
                  <Chats></Chats>
                    );
                    case 'chatbox':
                    return(
                     <ChatboxPage></ChatboxPage>
                    );



            }
        }

        



    

    return (
     
        isMyProfile ? (
            <div>
            <Navbar link_data={dash_nav_elements} />
            <div>
                {renprofile()}
            </div>
          
     
            </div>
        ) :
            ( 
                <div className="profile-page">
                  <h1>{notme.name}</h1>
                  <button onClick={startChat} >Start Conversation</button>

                </div>
            )
      



    );





}
export default Dashboard;