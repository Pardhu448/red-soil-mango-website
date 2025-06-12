import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './OrderPage.css';
import whatsappIcon from './images/whatsapp-icon.svg';
import parcelIcon from './images/packageWithHay.jpg';

const OrderPage: React.FC = () => {
  return (
    <div className="order-page">
      <Header />
      <main className="order-content">
        <h1>Order Mangoes</h1>
      
      <div className="order-section">
        <div className="order-method">
          <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
          <p>
            To order mangoes please contact us over WhatsApp at: 
            <a href="https://wa.me/916362316305" className="phone-number"> +91 6362316305</a>
          </p>
        </div>

        <div className="delivery-options">
          <div className="delivery-option">
            <h3>Pickup Option</h3>
            <p>You can directly pick mangoes from Kundanbagh (Begumpet)</p>
          </div>

          <div className="delivery-option">
            <img src={parcelIcon} alt="Parcel Delivery" className="parcel-icon" />
            <h3>Delivery Option</h3>
            <p>Make an order and we can arrange Uber Parcel delivery</p>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
