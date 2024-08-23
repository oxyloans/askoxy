import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons
import Landingpage from './Landingpage.js';
import logo from './images/logo.png'; 

import './App.css';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <Router>
      <div className="app d-flex flex-column min-vh-100">
        <nav className="nav">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/" onClick={toggleMenu}>Landingpage</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>About</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
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
          © 2024 Askoxy.AI. All Rights Reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
