import Button from "../Components/Button";
import React from 'react';
import { useNavigate } from "react-router-dom";
import Form from "../Components/Form";
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const button_data = {
    className: 'register-button',
    type: 'submit',
    label: 'Register',
  };

  const formdata = [
    { label: 'Name', type: 'text', name: 'name', key: 'username', placeholder: "John Doe" },
    { label: 'Email', type: 'email', name: 'email', key: 'email', placeholder: "......@gmail.com" },
    { label: 'Phone Number', type: 'text', name: 'phoneNumber', key: 'phoneNumber', placeholder: "e.g 2547**" },
    {
      label: 'Select Your Role', type: 'select', name: 'role', key: 'role', value: 'buyer', options: [
        { value: 'buyer' },
        { value: 'seller' }
       
      ]
    }
  ];

  const dest_url = "user/register";

  const redirect = () => {
    navigate('/login');
  };

  return (
    <div className="page-wrapper">
      <div className="register-card">
        <img src="\waridilogo (2).png" alt="Waridi Logo" className="logo" />
        <h2 className="title">Create Your Waridi Account</h2>

        <Form
          formData={formdata}
          button_data={button_data}
          dest_url={dest_url}
          id="register-form"
        />

        <div className="button-group">
          <button
            type="button"
            className="login-button secondary"
            onClick={redirect}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;