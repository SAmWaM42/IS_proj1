
import React, { useState, useEffect } from 'react';
function Cart() {
    const [visible, setVisible] = useState(false);
    const [loadedCart, setLoadedCart] = useState(false);
    const [cartData, setCartData] = useState([]);
    const url = "http://localhost:5000/product/cart";
    const chekoutUrl="http://localhost:5000/mpesa/checkout";


    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch(url, { credentials: 'include' });

                if (!response.ok) {
                    throw new Error("cart data not fetched")
                }
                const result = await response.json();
                setCartData(result);
            }
            catch (err) {
                console.log("error fetching cart:", err.message)
            }
            finally
            {
                setLoadedCart(true);
            }

        }
        fetchCartData();

    }, []);
  if (!cartData.cart || !cartData.cart.items || cartData.cart.items.length === 0) {
        return (
            <div>
                <p>Your cart is currently empty. Go grab some thrift finds!</p>
            </div>
        );
    }
   const checkout =async ()=>
   {
try
{
    console.log((cartData.cart));
    const response = await fetch(chekoutUrl,{
        method:"POST",
        credentials:'include',
        headers: {
                'Content-Type': 'application/json' // <--- THIS MUST BE HERE AND CORRECT
            },
     
        body:JSON.stringify(cartData.cart)
    })
    if(!response.ok)
    {
        throw new Error('checkout failed:transaction not initiates successfully');
    }
    
    const result=await response.json();
    console.log("checkout initiated:",result);
}
catch(err)
{
    console.log("error with chekout",err);
}


   }


    return (
        loadedCart ? (
            <div>
                {
                    cartData.cart.items.map((item) =>
                    (
                        <div>
                        <div>
                            <a href={`/product/${item.ProductID}`}>{item.name}</a>
                            <p>{item.price}</p>
                            <p>{item.quantity}</p>
                        </div>
                        <button type='button' onClick={checkout}> checkout</button>
                        </div>

                    ))



                } </div>


        ) : (
            <div>
                <h1>Loading cart data ....</h1>

            </div>



        )


    );



};

export default Cart;