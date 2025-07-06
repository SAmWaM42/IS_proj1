import Button from "../Components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Form  from "../Components/Form";
import './auth.css';


function  Auth()
{
    const button_data=
    { className: 'Confirm-button',
      type: 'submit',
      label: 'Confirm',
   
    }
    const formdata = [
       
        { label: 'Code', type: 'number', name: 'code', key: 'code' },
        { label: 'Password', type: 'password', name: 'password', key: 'password' },
        { label: 'Confirm Password', type: 'password', name: 'confirm_password', key: 'confirm_password' }
       
    ];
     
    const dest_url='user/2FA';



    return(
     <div> 
      
        <Form formData={formdata} button_data={button_data} dest_url={dest_url} id='auth-form'>send</Form>
         <button
       type="submit"
         form="auth-form"        // replace with your Form's form id, or wrap Form in <form id="login-form">
        className="login-button">Send</button>
        </div>
    );


    
   

}
export default Auth;

// This file is for the authentication page, which can be used for both login and registration.