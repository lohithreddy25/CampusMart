import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
      </div>
      <div className="nav-center">
        <h2>CampusCart</h2>
      </div>
      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/query">Query</Link>
      </div>
    </nav>
  );
}

export default Navbar;
