import Button from "../components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Form  from "../components/Form";
import './Login.css';


function Login()
{
    const button_data=
    { className: 'login-button',
      type: 'submit',
      label: 'Login',
   
    }
    const formdata = [
       
        { label: 'Email', type: 'email', name: 'email', key: 'email' },
        { label: 'Password', type: 'password', name: 'password', key: 'password' },
       
    ];
     
    const dest_url='user/login';



    return(

        <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
    );


    
   

}
export default Login;