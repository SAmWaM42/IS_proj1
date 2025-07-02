import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <img src="/banner.jpeg" alt="Thrifting" className="hero-image" />
        <div className="overlay"></div>
        <div className="hero-text">
          <h1 className="overlay-text">
  <span className="overlay-subtext">Welcome to</span> Waridi
</h1>



          <p>Discover affordable, sustainable fashion through a community-powered thrifting platform built for you.</p>
          <button className="signup-cta" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Waridi. All rights reserved.</p>
        <div className="social-icons">
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-x-twitter"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
