
import React, { useState, useEffect ,useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './ContextWrapper';


function Navbar({link_data,renderButton})
{
   const contextData = useContext(GlobalContext);
 
   const navigate=useNavigate();
  const{cartVisible,setCartVisible,loggedIn,handleUpdate}=contextData;


    
  const make_visible=()=>
  {
   setCartVisible(prev=>!prev);

  };
  console.log(loggedIn);
  const logOut=async ()=>
  {
    const url="http://localhost:5000/user/logout";
    try
    {
      const response=await fetch(url,{
        credentials:"include"
      }) 
      if(!response.ok)
      {
        throw new Error("error loggong out")
       
      }
      const result=await response.json();
       
      handleUpdate({myData:result,loggedIn:false});
      navigate('/login');
      alert(result.message);

    }
    catch(err)
    {

    }

  }

    
    return(
        <div>
           <nav>
             {
                link_data.map((data)=> <Link to={data.destination} key={data.key} > {data.Label} </Link>)
             }

             {
             
              loggedIn&&
              (  
                renderButton&&
                (
               <div>
                <button onClick= {logOut}>Logout</button>
                <button style={{marginLeft:'10em'}} onClick={make_visible}>Cart</button>

             </div>
                )
               )

             }
           </nav>
           

        </div>
        
    );



};

export default Navbar;

