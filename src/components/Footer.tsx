import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <div className="links-column footer-links1">
            <h3>Other Useful Links</h3>
            <ul>
              <li><a href="https://food.berkeley.edu/mission/urban-and-rural-agroecology/" target="_blank" rel="noopener noreferrer">Agroecology</a></li>
              <li><a href="https://www.permaculture.org/" target="_blank" rel="noopener noreferrer">Permaculture</a></li>
              <li><a href="https://f-masanobu.jp/en/?srsltid=AfmBOoqFfvVSijY1TvUESoZ32-Otqf1n3kWWagBmZVlb1-DMTxNFqUNu" target="_blank" rel="noopener noreferrer">Natural Farming</a></li>
            </ul>
          </div>
          
          <div className="links-column footer-links2">
            <ul>
              <li><a href="#">Gallery</a></li>
              <li><a href="#">FSSAI</a></li>
              <li><a href="#">GSTIN</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#">How to Reach Farm ?</a></li>
            </ul>
          </div>
        </div>
        <div className="contact-info">
          <div className="copyright">
            © 2025 Red Soil Mango Farm. All Rights Reserved.
          </div>
          <div className="email">
            <a href="mailto:support@redsoilmango.com">support@redsoilmango.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
