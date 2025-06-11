
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function Navbar({link_data})
{

    
    return(
        <div>
           <nav>
             {
                link_data.map((data)=> <Link to={data.destination} key={data.key} > {data.Label} </Link>)
             }


           </nav>

        </div>
        
    );



};

export default Navbar;