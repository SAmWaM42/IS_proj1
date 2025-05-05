import React, { useState, useEffect } from 'react';
import './Button.css';
function Button(type,design) {
    const [button_logo, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/home').then(response => response.json()).then(data => setMessage(data.message));
}, []);
if(type === 'submit') 
{

}
 

    return (
        <div>
            <button type={type} className={design} >{button_logo}</button>
        </div>
    );
}


export default Button;

