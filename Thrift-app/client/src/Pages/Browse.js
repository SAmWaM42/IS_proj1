import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';
import Card from '../Components/Card';


function Browse() {
    const url = `http://localhost:5000/product`;
    const sessionUrl = `http://localhost:5000/user/me`
    const navigate = useNavigate();
   
    const [products, setProducts] = useState([]);
    const [sessionData, setSessionData] = useState(null);
    const [LoadingSession, setLoadingSession] = useState(true);
    const [LoadingProducts, setLoadingProducts] = useState(true);
    const [searchValues,setSearchValues]=useState(null)

    useEffect(() => {
        try {
            fetch(url).then(response => response.json()).then(data => setProducts(data))
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setLoadingProducts(false);
        }
        finally {
            setLoadingProducts(false)
        }
    }, [url]);

    useEffect(() => {
        const checkSession = async () => {
            fetch(sessionUrl,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => {

                    if (response.ok) { // Check for 2xx status codes

                        // Your backend might send { loggedIn: true } or user data
                        setSessionData(true); // Adjust based on your backend response
                    } else if (response.status === 401 || response.status === 403) {
                        console.log("Session not active/expired.");
                        setSessionData(false);
                        // You might want to redirect to login here
                    }
                }).catch(error => console.error('Error fetching session data:', error));
        }
        try{
        checkSession();
        }
        catch (error) {
            console.error('Error checking session:', error);
            setLoadingSession(false);
        }      finally {
            setLoadingSession(false);
        }
    }, [sessionUrl]);
    console.log(sessionData);
    useEffect(() => {
        if (!sessionData && !LoadingSession && !LoadingProducts) {
            console.log("Session not active/expired. Redirecting to login.");
            navigate('/Login'); // Redirect to login if session is not active
        }
    }, [sessionData, navigate]);
    
        const Search=async (e)=>
        {
            e.preventDefault()
            try{
                let urlS;
                if(!searchValues || !searchValues.search || searchValues.search.trim() === '')
                {
                  urlS=url;
                }else
                {
                  urlS=`http://localhost:5000/product/search/${searchValues.search}`;
                }
            const response= await fetch(urlS,{credentials:'include'});
            if(!response.ok)
            {
                 throw new Error("error getting data");

            }
            const result= await response.json();
          
            setProducts(result);
            

            }
            catch(err)
            {
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

    return (

        <div className="browse-container">
            <h1>Browse Products</h1>
            {
               
                (products.length) ? (
                    <div>
                        <form onSubmit={Search} >
                            <input type='text' name='search' onChange={handleInputChange}></input>
                            <button  type='submit'>Search</button>
                        </form>
                    <div className="product-list">
                        {

                            products.map((data) =>
                                <Card data={data} />
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


export default Browse;