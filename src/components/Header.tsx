import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../images/logo.svg';
import youtubeIcon from '../images/youtube-icon.svg';
import instagramIcon from '../images/instagram-icon.svg';
import whatsappIcon from '../images/whatsapp-icon.svg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/home">
          <img src={logo} alt="Red Soil Mango Logo" />
        </Link>
      </div>
      <div className="nav-container">
        <nav className="nav-menu">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/farm">Farm</a></li>
            <li><a href="/mango">Mango</a></li>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <li><a href="#">Order</a></li>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <div className="social-icons">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#"><img src={youtubeIcon} alt="YouTube" /></a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#"><img src={whatsappIcon} alt="WhatsApp" /></a>
        </div>
      </div>
    </header>
  );
};

export default Header;
