import Form from '../Form/Form.js';
import Button from '../Button/Button.js';
import './login.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';


function Login() {

    var fields = {};
    const input_field =
    {
        name: '',
        email: '',
        password: '',


    };
    const form_field =
    {
        name: '',
        id: '',
        type: ''



    }
    var id = useLocation();
    console.error(id);
   

    if (id.pathname === '/Register') {
        fields = [
            { name: 'name', id: 'name', type: 'text', value: input_field.name },
            { name: 'email', id: 'email', type: 'email', value: input_field.email },
            { name: 'password', id: 'password', type: 'password', value: input_field.password },

        ];
    }
    else if (id.pathname === '/Login') {
        fields = [

            { name: 'email', id: 'email', type: 'email', value: input_field.email },
            { name: 'password', id: 'password', type: 'password', value: input_field.password },

        ];



    }
    else 
    {
        fields = [];
        console.error('Invalid route');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        // Here you can send the data to your server
        // For example, using fetch:
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }



    return (

       <Form fields={fields} onSubmit={handleSubmit} />


    )


}



export default Login;