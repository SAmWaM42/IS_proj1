
import React, { useState, useEffect ,useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import { GlobalContext } from './ContextWrapper';


function Navbar({link_data})
{
   const contextData = useContext(GlobalContext);
 
  
  const{cartVisible,setCartVisible,loggedIn}=contextData;


    
  const make_visible=()=>
  {
   setCartVisible(prev=>!prev);

  };
  console.log(loggedIn);

    
    return(
        <div>
           <nav>
             {
                link_data.map((data)=> <Link to={data.destination} key={data.key} > {data.Label} </Link>)
             }

             {
              loggedIn&&
              (  
                <button onClick={make_visible}>Cart</button>
              )

             }
           </nav>
           

        </div>
        
    );



};

export default Navbar;

