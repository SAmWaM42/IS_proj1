import Button from "../Components/Button";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Form  from "../Components/Form";
import './Register.css';

function Register() {
    const navigate = useNavigate();

  const button_data = {
    className: 'register-button',
    type: 'submit',
    label: 'Register',
  };

  const formdata = [
    { label: 'Name', type: 'text', name: 'name', key: 'username' ,placeholder:"John Doe"},
    { label: 'Email', type: 'email', name: 'email', key: 'email',placeholder:"......@gmail.com" },
    { label: 'phoneNumber', type: 'text', name: 'phoneNumber', key: 'phoneNumber' ,placeholder:"e.g 2547********" },
    { label: 'Select Your Role', type: 'select', name: 'role', key: 'role',value:'buyer',options:[
       {value:'buyer'},
       {value:'seller'},
        {value:'admin'}
    ]
      
    }
   
  ];

  const dest_url = "user/register"; // This should be the endpoint for registration
  
  const redirect=()=>
  {
    navigate('/login');
  };
  return (
    <div className="register-page">
      <div className="register-card">
        <img src="\waridilogo (2).png" alt="Waridi Logo" className="logo" />
        <h2 className="title">Create Your Waridi Account</h2>
        <Form formData={formdata} button_data={button_data} dest_url={dest_url} id='register-form'/>

    {/*addition*/}

<div className="button-group">
       <button
         type="submit"
         form="register-form"
         className="register-button"
       >
         Sign Up
       </button>

       <button
         type="button"
         className="login-button secondary"
         onClick={redirect}
       >
         Sign In
       </button>
     </div>
{/*addition*/}
      </div>
    </div>
  );
}

export default Register;
