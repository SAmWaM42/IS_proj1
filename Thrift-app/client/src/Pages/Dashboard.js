
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Form from '../Components/Form'
function Dashboard() {

    const url='http://localhost:5000/user/me'
    const {userId} = useParams(); // ID from the URL (e.g., /profile/abc123)
    const[me,setme]  = useState(null);
    const [notme,setNotme]=useState(null);
    const[loadedMe,setloadedMe]=useState(false);
    const[loadedNotMe,setloadedNotMe]=useState(false);

      const isMyProfile = loadedMe && me && me._id.toString() === userId;
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
    }catch(err)
    {
        console.log(err);
    }

};
        getnotme();
      

    },[userId])
 
   

   
  
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

    const dest_url = 'product';
   

if (!loadedMe||!loadedNotMe) {
        return <div>Loading your profile status...</div>;
    }


    return (
     
        isMyProfile ? (

            <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
        ) :
            (
                <div className="profile-page">
                  <h1>{notme.name}</h1>

                </div>
            )
      



    );





}
export default Dashboard;