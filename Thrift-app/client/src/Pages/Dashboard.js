
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import './Dashboard.css';
import Form from "../Components/Form";


function Dashboard()
{
    const button_data=
    { className: 'Upload-button',
      type: 'submit',
      label: 'Upload',
   
    }
    const formdata = [
       
        { label: 'name', type: 'text', name: 'name', key: 'name' },
        { label: 'description', type: 'text', name: 'description', key: 'description' },
        { label: 'price', type: 'number', name: 'price', key: 'price' },
         { label: 'Image', type: 'file', name: 'image', key: 'image' }
       
    ];
     
    const dest_url='product';



    return(

        <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
    );


    
   

}
export default Dashboard;