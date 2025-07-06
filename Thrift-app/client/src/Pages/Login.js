import Button from "../Components/Button";
import React, { useState, useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Form  from "../Components/Form";
import './Login.css';
import { GlobalContext } from '../Components/ContextWrapper.js';


function Login()
{

  const contextData = useContext(GlobalContext);
  const {loggedIn} = contextData;

  
    const navigate = useNavigate();

  
  
    const formdata = [
       
        { label: 'email', type: 'email', name: 'email', key: 'email' },
        { label: 'password', type: 'password', name: 'password', key: 'password' },
       
    ];
     
    const dest_url='user/login';



    return (
  <div className="login-page">
    <div className="login-card">
      <img src="\waridilogo (2).png" alt="Waridi Logo" className="logo" />
      <h2 className="title">Welcome to Waridi</h2>


<Form formData={formdata} dest_url={dest_url}  id='login-form'/>

     {/*added*/}
    <div className="button-group">
       <button
         type="submit"
         form="login-form"        // replace with your Form's form id, or wrap Form in <form id="login-form">
        className="login-button"
       >
         Sign In
      </button>

       <button
         type="button"
        className="signup-button secondary"
       onClick={() => navigate('/register')}
     >       Sign Up
      </button>
    </div>


 {/*end of addition*/}
    </div>
  </div>
);

    
   

}
export default Login;