import React from 'react';
import './Header.css';
import logo from '../images/logo.svg';
import youtubeIcon from '../images/youtube-icon.svg';
import instagramIcon from '../images/instagram-icon.svg';
import whatsappIcon from '../images/whatsapp-icon.svg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Red Soil Mango Logo" />
      </div>
      <div className="nav-container">
        <nav className="nav-menu">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Farm</a></li>
            <li><a href="#">Mango</a></li>
            <li><a href="#">Order</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <div className="social-icons">
          <a href="#"><img src={youtubeIcon} alt="YouTube" /></a>
          <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
          <a href="#"><img src={whatsappIcon} alt="WhatsApp" /></a>
        </div>
      </div>
    </header>
  );
};

export default Header;
