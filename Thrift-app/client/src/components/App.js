import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Button from './Button/Button.js';
import Form from './Form/Form.js';
import NavBar from './NavBar/NavBar.js';
import Test from './Test/test.js';
import Home from './Home/Home.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    const [message, setMessage] = useState('');
    const nav_elements = [
        //modify this to add more elements to the navbar
        { key: 'home', name: 'Home', destination: '/' },
        { key: 'test', name: 'test', destination: '/test' }

    ];

    useEffect(() => {
        fetch('http://localhost:5000/').then(response => response.json()).then(data => setMessage(data.message));
    }, []);
    const get_test_var = (value) => {
        var link='http://localhost:5000'.concat(value);

        fetch(link).then(response => response.json()).then(data => setMessage(data.message));
        
    };

    return (
        <div>
            <NavBar elements={nav_elements} />
            
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/test" element={<Test/>} />
            </Routes>

           
            
        </div>
    );
}


export default App;
