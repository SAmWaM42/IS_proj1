import React, { useState, useEffect } from 'react';
import './Button.css';
function Button(data) 
{
    const url= `http://localhost:5000/${data.type}`;
    const [message, setMessage] = useState('');
    useEffect(() => {
            fetch(url).then(response => response.json()).then(data => setMessage(data.message));
         }, []);

         return(
            <button className={data.type}>
              {message}
            </button>
         )
}

export default Button;
import 'Thrift-app\client\src\components\Button.css';