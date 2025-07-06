
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';
import Card from '../Components/Card';


function ViewProducts(){


    const navigate = useNavigate();

    const url = "http://localhost:5000/product/get-Products";
    const removeUrlBase="http://localhost:5000/product/remove-Product"
 
   
    const [products, setProducts] = useState([]);
    const [LoadingProducts, setLoadingProducts] = useState(true); const [searchValues,setSearchValues]=useState(null)

    useEffect(() => {
        try {
            fetch(url,{credentials:'include'}).then(response => response.json()).then(data => setProducts(data))
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setLoadingProducts(false);
        }
        finally {
            setLoadingProducts(false)
        }
    }, [url]);

   
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
    const removeProd=async (id)=>
    {
        try
        {
         const response = await fetch(`${removeUrlBase}/${id}`,{credentials:'include'});
         if(!response.ok)
         {
            throw new Error("error removing product")

         }

         const result=await response.json();
         alert(result.message); 


        }
        catch(err)
        {
            alert("error removing product",err)
        }
           



    }

    return (

        <div className="browse-container">
            <h1>Your Added products</h1>
            {
               
                (products.length) ? (
                    <div>
                       
                    <div className="product-list">
                        {

                            products.map((data) =>
                                <div>
                                <Card data={data}/>
                                <button  onClick={()=>removeProd(data._id)}>Unlist Product</button>
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


export default ViewProducts;