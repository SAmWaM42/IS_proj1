import Button from "../Components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Form  from "../Components/Form";
import './Login.css';


function Login()
{
    const button_data=
    { className: 'login-button',
      type: 'submit',
      label: 'Login',
   
    }
    const formdata = [
        { label: 'Username', type: 'text', name: 'username', key: 'username' },
        { label: 'Password', type: 'password', name: 'password', key: 'password' },
        { label: 'Email', type: 'email', name: 'email', key: 'email' }
    ];
     
    const dest_url='login';



    return(

        <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
    );


    
   

}
export default Login;