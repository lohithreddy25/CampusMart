import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="search-section">
        <input type="text" placeholder="SEARCH..." />
        <button>
          <span role="img" aria-label="search">🔍</span>
        </button>
      </div>
      <div className="about-section">
        <h1>Welcome to CampusCart</h1>
        <p>
        Campus Exchange is a platform where students can share, lend, or exchange items within their college. Whether it's books, gadgets, or daily essentials, students can easily search and connect with others. If an item isn’t found, users can post a query that notifies everyone. With built-in chat and notifications, exchanging becomes simple and seamless.
        </p>
      </div>
    </div>
  );
}

export default Home;
