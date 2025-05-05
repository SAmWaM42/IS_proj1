
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavBar({elements}) {
    //add potential fetch of user data here



    return (
        <ul>

            {
                elements.map((element) =>
                (
                 <li id={element.key} key={element.key}> 
                     <Link to={element.destination} >{element.name}</Link>
                 </li> 
                  )

                )
            }


        </ul>
    );
}


export default NavBar;

