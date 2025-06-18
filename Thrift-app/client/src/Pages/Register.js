import Button from "../components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Form  from "../components/Form";
import './Register.css';


function Register()
{
    const button_data=
    { className: 'register-button',
      type: 'submit',
      label: 'Register',
   
    }
    const formdata = [
        { label: 'name', type: 'text', name: 'name', key: 'username' },
        { label: 'Email', type: 'email', name: 'email', key: 'email' }
    ];
    const dest_url="user/register"; // This should be the endpoint for registration


    return(

        <Form formData={formdata} button_data={button_data} dest_url={dest_url}></Form>
    );


    
   

}
export default Register;