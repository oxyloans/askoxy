import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Landingpage from './Landingpage.js';
import logo from './images/logo.png'; 

import './App.css';

function App() {
  return (
    <Router>
      <div className="app d-flex flex-column min-vh-100">
        <nav className="nav">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>
          <ul>
            <li>
              <Link to="/">Landingpage</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <div className="content flex-grow-1">
          <Routes>
            <Route path="/" element={<Landingpage />} />
            {/* <Route path="/about" element={<AboutCard />} />
            <Route path="/contact" element={<ContactCard />} /> */}
          </Routes>
        </div>

        <footer className="footer bg-dark text-white text-center py-3">
          © 2024 Your Company. All Rights Reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
