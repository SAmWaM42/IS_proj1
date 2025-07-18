import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';
import Navbar from '../Components/Navbar.js';
import Auth from './auth.js';
import Dashboard from './Dashboard.js';
import Browse from './Browse.js';
import IndividualProduct from './IndividualProduct.js';
import Cart from '../Components/Cart.js';
import { GlobalContext } from '../Components/ContextWrapper.js';



function App() {
    const contextData = useContext(GlobalContext);
    const [message, setMessage] = useState('');
    const { cartVisible, myData, loggedIn,gottenSelf } = contextData;
    let nav_elements = [];
    let renderButton=false;


    nav_elements = [
        //modify this to add more elements to the navbar
        { key: 'home', Label: 'Home', destination: '/' },
        { key: 'login', Label: 'Login', destination: '/Login' },
        { key: 'register', Label: 'Register', destination: '/Register' },
        { key: 'browse', Label: 'Browse', destination: '/Browse' },

    ]

    if (loggedIn) {
        nav_elements = [
            { key: 'home', Label: 'Home', destination: '/' },
            { key: 'dashboard', Label: 'Dashboard', destination: '/Dashboard' },
            { key: 'browse', Label: 'Browse', destination: '/Browse' },
        ]
        
   renderButton=true;
    }




   
    
    return (
        gottenSelf?
        (

        <div>
            <Navbar link_data={nav_elements} renderButton={renderButton}/>
            {
                cartVisible &&
                (
                    <Cart></Cart>
                )

            }

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/Dashboard" element={<Dashboard></Dashboard>} />
                <Route path="/Dashboard/AddProduct" element={<Dashboard></Dashboard>} />
                <Route path="/Dashboard/Chats" element={<Dashboard></Dashboard>} />
                <Route path="/Dashboard/Chatbox/:chatId" element={<Dashboard></Dashboard>} />
                <Route path='/Dashboard/Profile' element={<Dashboard></Dashboard>} />
                <Route path='/Dashboard/myProducts' element={<Dashboard></Dashboard>}/>
                <Route path='/Dashboard/myOrders' element={<Dashboard></Dashboard>}/>
                 <Route path='/Dashboard/userOrders' element={<Dashboard></Dashboard>}/>
                  <Route path='/Dashboard/adminUser' element={<Dashboard></Dashboard>}/>
                   <Route path='/Dashboard/adminProd' element={<Dashboard></Dashboard>}/>
                <Route path="/Browse" element={<Browse></Browse>} />
                <Route path="/product/:id" element={<IndividualProduct></IndividualProduct>} />
                <Route path="/user/:userId" element={<Dashboard></Dashboard>} />
                
        


            </Routes>


        </div>
        ):
        (
            <div>
            <h1>Loading application</h1>
            </div>
        )
    );
}


export default App;

