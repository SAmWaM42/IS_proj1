import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';
import Card from '../Components/Card';

function Browse() {
  const url = `http://localhost:5000/product`;
  const sessionUrl = `http://localhost:5000/user/me`;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [LoadingSession, setLoadingSession] = useState(true);
  const [LoadingProducts, setLoadingProducts] = useState(true);
  const [searchValues, setSearchValues] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error('Error fetching products:', err);
        setProducts([
          {
            name: "White Skirt",
            description: "Elegant long flowy skirt perfect for summer outings.",
            imageUrl: "images/white_skirt.png",
            price: "$29"
          },
          {
            name: "Red Top",
            description: "Bold red fitted top with a square neckline.",
            imageUrl: "images/red_top.png",
            price: "$19"
          },
          {
            name: "Flowery Top",
            description: "Colorful floral pattern with soft fabric.",
            imageUrl: "images/flowery_top.png",
            price: "$25"
          },
          {
            name: "White Skirt",
            description: "Another style with side slit and pleats.",
            imageUrl: "images/white_skirt_2.png",
            price: "$27"
          },
          {
            name: "Green Top",
            description: "Fresh green puffed sleeve crop top.",
            imageUrl: "images/green_top.png",
            price: "$21"
          },
          {
            name: "Naggy Jeans",
            description: "High-rise vintage style baggy jeans.",
            imageUrl: "images/naggy_jeans.png",
            price: "$34"
          },
          {
            name: "Gold Heels",
            description: "Shiny gold heels to match your party outfit.",
            imageUrl: "images/gold_heels.png",
            price: "$49"
          },
          {
            name: "Pink Dress",
            description: "A-line soft pink dress with lace details.",
            imageUrl: "images/pink_dress.png",
            price: "$39"
          },
          {
            name: "Purple Top",
            description: "Sleek lavender knit top with ribbed texture.",
            imageUrl: "images/purple_top.png",
            price: "$22"
          }
        ]);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      fetch(sessionUrl, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            setSessionData(true);
          } else if (response.status === 401 || response.status === 403) {
            setSessionData(false);
          }
        })
        .catch(error => console.error('Session error:', error))
        .finally(() => setLoadingSession(false));
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!sessionData && !LoadingSession && !LoadingProducts) {
      navigate('/Login');
    }
  }, [sessionData, LoadingSession, LoadingProducts, navigate]);

  const Search = async (e) => {
    e.preventDefault();
    try {
      let urlS = (!searchValues || !searchValues.search.trim())
        ? url
        : `http://localhost:5000/product/search/${searchValues.search}`;
      const response = await fetch(urlS, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed search');
      const result = await response.json();
      setProducts(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
return (
  <div className="browse-container">
    <h1>Browse Products</h1>
    <form onSubmit={Search}>
      <input
        type='text'
        name='search'
        onChange={handleInputChange}
        placeholder='Search products...'
      />
      <button type='submit'>Search</button>
    </form>

    {products.length > 0 ? (
      <div className="product-list">
        {products.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
    ) : (
      <p>No products available</p>
    )}
  </div>
);

}

export default Browse;
