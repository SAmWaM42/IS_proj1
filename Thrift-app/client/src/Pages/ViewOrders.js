
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function ViewOrders() {


    const navigate = useNavigate();

    const url = "http://localhost:5000/product/get-Orders";



    const [products, setProducts] = useState([]);
    const [LoadingProducts, setLoadingProducts] = useState(true); const [searchValues, setSearchValues] = useState(null)
    const [visibleItemIds, setVisibleItemIds] = useState(new Set());

    useEffect(() => {
        try {
            fetch(url, { credentials: 'include' }).then(response => response.json()).then(data => setProducts(data))
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setLoadingProducts(false);
        }
        finally {
            setLoadingProducts(false)
        }
    }, [url]);


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




    return (

        <div className="browse-container">
            <h1>Your Orders </h1>
            {

                (products.length) ? (
                    <div>
                        <form onSubmit={Search} >
                            <input type='text' name='search' onChange={handleInputChange}></input>
                            <button type='submit'>Search</button>
                        </form>
                        <div>
                            {

                                products.map((data) =>

                                    <div>
                                        
                                        <div>
                                            <h3>User:{data.name}</h3>
                                            <h3>transactionID:{data.transactionID}</h3>
                                            <h3>transactionStatus:{data.status}</h3>
                                            <h3>totalPayment:{data.totalPrice}</h3>
                                            <h3>completionDate:{data.completionDate}</h3>
                                            <button onClick={() => displayItems(data._id)}>Items</button>
                                        </div>
                                         {visibleItemIds.has(data._id) && (
                                        <div >
                                            
                                            {data.items.map((item) =>
                                            
                                                <div >
                                                    <h3>ItemName:{item.name}</h3>
                                                    <h3>itemQuantity:{item.quantity}</h3>
                                                    <h3>itemPrice:{item.price}</h3>
                                                    <h3>totalPrice:{item.price * item.quantity}</h3>
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


export default ViewOrders;