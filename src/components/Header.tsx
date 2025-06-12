import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../images/logo.svg';
import youtubeIcon from '../images/youtube-icon.svg';
import instagramIcon from '../images/instagram-icon.svg';
import whatsappIcon from '../images/whatsapp-icon.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Link to="/home">
            <img src={logo} alt="Red Soil Mango Logo" />
          </Link>
        </div>
      </div>

      <div className="header-bottom">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
        <nav className="nav-menu">
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/farm" onClick={() => setIsMenuOpen(false)}>Farm</Link></li>
            <li><Link to="/mango" onClick={() => setIsMenuOpen(false)}>Mango</Link></li>
            <li><Link to="/order" onClick={() => setIsMenuOpen(false)}>Order</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            <li className="social-icon-item">
              <a href="#"><img src={youtubeIcon} alt="YouTube" /></a>
            </li>
            <li className="social-icon-item">
              <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
            </li>
            <li className="social-icon-item">
              <a href="#"><img src={whatsappIcon} alt="WhatsApp" /></a>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
