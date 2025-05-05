import React, { useState, useEffect } from 'react';
import  './Item.css';
import Button from '../Button/Button.js';
function Item() {
    const [item_data, setData] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/home').then(response => response.json()).then(data => setData(data.message));
}, []);

  const add_to_cart = (item) =>
  {
    jsonData = JSON.stringify(item);
    fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', },
        body: jsonData,
    })

  }

    return (
        item_data.map((item) => (
        <div className="item" key={item.id}>
           <img src={item.image} alt={item.name} />
            <a href={itemPage}> <h2>{item.name}</h2> </a>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Condition: {item.condition}</p>  
            <Button type="button" design="add-to-cart-button"  onClick={add_to_cart} />

        </div>
        ))
      
    );
}


export default Item;
