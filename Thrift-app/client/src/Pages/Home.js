import react from "react";
import React, { useState, useEffect } from 'react';
function Home()
{

     const [message, setMessage] = useState('');
      useEffect(() => {
              fetch('http://localhost:5000/').then(response => response.json()).then(data => setMessage(data.message));
          }, []);
          return(
              <div>
                <h1>{message}</h1>
              </div>
          );
}
export default Home;