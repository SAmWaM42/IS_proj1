import React, { useState, useEffect } from 'react';
import './Button.css';
function Button(type,design) {
    const [button_logo, setMessage] = useState('');
    const url=`http://localhost:5000/${type}`;
    
      

useEffect(() => 
{
        fetch(url).then(response => response.json()).then(data => setMessage(data.message));
}, []);
    // type is the type of button, design is the design class
    // type can be 'submit', 'button', etc.

    return (
        <div>
            <button type={type} className={design} >{button_logo}</button>
        </div>
    );
}


export default Button;

