
import React, { useState, useEffect } from 'react';

function Test() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/test')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <p>{message}</p>
    </div>
  );
}

export default Test;