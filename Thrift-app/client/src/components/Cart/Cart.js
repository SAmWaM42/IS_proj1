import React, { useState, useEffect } from 'react';
import Button from '../Button/Button.js';
import './Cart.css';
function Cart({ fields, onSubmit })
 {
    const [formData, setFormdata] = useState({});
//switch this to a post to send data to the server
    useEffect(() => {
        fetch('http://localhost:5000/cart').then(response => response.json()).then(data => setFormdata(data.message));
    }, []);
    let content = null;
    const remove_from_cart = (item) =>
    {
        jsonData = JSON.stringify(item);
        fetch('http://localhost:5000/cart', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', },
            body: jsonData,
        })
    }
    return (
        <>
       { formData.map((item) =>
        (
            <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <h2>{item.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Condition: {item.condition}</p>
                <Button type="button" design="remove-from-cart-button"  onClick={remove_from_cart} />
            </div>

        ))
    }
 


            
        </>
    );
}