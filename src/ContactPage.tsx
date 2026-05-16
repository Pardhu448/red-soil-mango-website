import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <Header />
      <main className="contact-content">
        <h1>Contact Us</h1>
        
        <div className="address-section">
          <div className="address-card">
            <h2>Hyderabad</h2>
            <address>
              Partha<br />
              Rukmini Lake View Apartments<br />
              Methodist Colony, Kundanbagh<br />
              Begumpet, Hyderabad - 500016
            </address>
          </div>

          <div className="address-card">
            <h2>Picharagad</h2>
            <address>
              Ramulu.C<br />
              1-6A25/1, Kothillu<br />
              Picharagad Village, Kohir Mandal<br />
              Sangareddy District, Telangana - 502210
            </address>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
