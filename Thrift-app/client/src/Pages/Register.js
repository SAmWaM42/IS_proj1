import Button from "../Components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Form  from "../Components/Form";
import './Login.css';


function Register()
{
    const button_data=
    { className: 'register-button',
      type: 'submit',
      label: 'Register',
   
    }
    const formdata = [
        { label: 'Username', type: 'text', name: 'username', key: 'username' },
        { label: 'Password', type: 'password', name: 'password', key: 'password' },
        { label: 'Email', type: 'email', name: 'email', key: 'email' }
    ];



    return(

        <Form formData={formdata} button_data={button_data}></Form>
    );


    
   

}
export default Register;