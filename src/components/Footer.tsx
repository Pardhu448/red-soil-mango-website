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
              <li><a href="#">Agroecology</a></li>
              <li><a href="#">Permaculture</a></li>
              <li><a href="#">Natural Farming</a></li>
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
