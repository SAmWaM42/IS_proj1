
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function UserOrders() {


    const navigate = useNavigate();

    const url = "http://localhost:5000/product/get-user-Orders";
    const claimUrl="http://localhost:5000/product/claim-Orders"



    const [products, setProducts] = useState([]);
    const [LoadingProducts, setLoadingProducts] = useState(true);
     const [searchValues, setSearchValues] = useState(null)
    const [visibleItemIds, setVisibleItemIds] = useState(new Set());
   

        const getProducts=async () => {
        try {
            await fetch(url, { credentials: 'include' }).then(response => response.json()).then(data => setProducts(data))
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setLoadingProducts(false);
        }
        finally {
            setLoadingProducts(false)
        }
    };

    useEffect(()=>
    getProducts(),[url]);


    const Search = async (e) => {
        e.preventDefault()
        try {
            let urlS;
            if (!searchValues || !searchValues.search || searchValues.search.trim() === '') {
                urlS = url;
            } else {
                urlS = `http://localhost:5000/product/search/${searchValues.search}`;
            }
            const response = await fetch(urlS, { credentials: 'include' });
            if (!response.ok) {
                throw new Error("error getting data");

            }
            const result = await response.json();

            setProducts(result);


        }
        catch (err) {
            console.log(err.message);

        }



    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    };

    const displayItems = (id) => {
        setVisibleItemIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(id)) {
                newIds.delete(id);
            } else {
                newIds.add(id);
            }
            return newIds;
        });

    }
    const claimItem=async (id)=>
    {
        try
        {
            const response=await fetch(`${claimUrl}/${id}`,{credentials:'include',method:'POST'})
            if(!response.ok)
            {
               throw new Error("network error while claimimg product")
            }

         window.location.reload();

        }
        catch(err)
        {
            console.log("error claiming produt",err)
        }

    }
    if(LoadingProducts)
    {
        return(
            <h1>Loading your Orders</h1>
        );
    }



    return (

        <div className="browse-container">
            <h1>Your current products</h1>
            {

                (products.length) ? (
                    <div>
                    
                        <div>
                            {

                                products.map((data) =>

                                    <div>
                                        
                                        <div>
                                            <h3>Vendor:{data.name}</h3>
                                            <h3>transactionID:{data.transactionID}</h3>
                                            <h3>transactionStatus:{data.status}</h3>
                                            <h3>totalPayment:{data.totalPrice}</h3>
                                            <h3>completionDate:{data.completionDate}</h3>
                                            <button onClick={() => displayItems(data._id)}>Items</button>
                                              <button onClick={()=>claimItem(data._id)}>Collect Order</button>
                                        </div>
                                         {visibleItemIds.has(data._id) && (
                                        <div >
                                            
                                            {data.items.map((item) =>
                                            <div>
                                                <div >
                                                    <h3>ItemName:{item.name}</h3>
                                                    <h3>itemQuantity:{item.quantity}</h3>
                                                    <h3>itemPrice:{item.price}</h3>
                                                    <h3>totalPrice:{item.price * item.quantity}</h3>
                                                </div>
                                              
                                                </div>
                                            )}
                                        </div>
                                         )}


                                    </div>
                                )
                            }
                        </div>


                    </div>
                ) :
                    (<div>

                        <p>No products available</p>
                    </div>
                    )

            }

        </div>

    )


}


export default UserOrders;