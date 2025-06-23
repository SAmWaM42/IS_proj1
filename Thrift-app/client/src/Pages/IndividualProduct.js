import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- useParams imported here!
import './IndividualProduct.css'; // Assuming you'll have a CSS file for this component

function IndividualProduct() {
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // Renamed data to product for clarity
    const [seller,setSeller]=useState(null);
    const [loading, setLoading] = useState(true); // State to track loading status
    const[loadingUser,setLoadingUser]=useState(true)
    const [error, setError] = useState(null); // State to track any errors

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/product/${id}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch product');
                }

                const result = await response.json();
                setProduct(result); // Set fetched data to 'product' state
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message);
            } finally {
                setLoading(false); // Done loading, regardless of success or failure
            }
        };

        fetchProduct();
    }, [id]);
     // Dependency array: re-run if 'id' changes
     useEffect(()=>
     { const getsellername=async ()=>
     {
        try
        {
            const res=await fetch(`http://localhost:5000/user/${product.UserID}`);
            
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to Seller');
                }
            const seller=await res.json();
            setSeller(seller); 
            setLoadingUser(false);
        }
        catch(err)
        {

       console.log(err);
        }
    };
    if(!loading&&loadingUser)
    {
    getsellername();
    }
     }
    )

    

    if (!product) { // If product is null after loading (e.g., product not found)
        return <div className="individual-product">Product not found.</div>;
    }

    // --- Main Product Display ---
    return (
        <div className="individual-product-container"> {/* Renamed for better styling hook */}
            <div className="product-image-section">
                <img
                    src={`http://localhost:5000/${product.imageUrl}`} // Use product.imageUrl
                    alt={product.name}
                    className="product-main-image" // Clearer class name
                />
            </div>
            <div className="product-details-section">
                <h1 className="product-title">{product.name}</h1> {/* Use h1 for main title */}
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price}</p>

                {/* Seller Information - Crucial for your chat flow */}
                <div className="product-seller-info">
                    {/* Assuming seller is nested in your product data */}
                    <p>Sold by:
                      { !loadingUser?(
                            <span className="seller-name-link">
                                  <Link to={`/user/${product.UserID}`}>{seller.name}</Link>
                            </span>)
:(
   <p>Loading user </p>
)


                      }
                    </p>
                    
                   
                </div>

                {/* Add other buttons/features here, e.g., Add to Cart, Buy Now */}
                <div className="product-actions">
                    <button className="add-to-cart-button">Add to Cart</button>
                    <button className="buy-now-button">Buy Now</button>
                </div>
            </div>
        </div>
    );
}

export default IndividualProduct;
