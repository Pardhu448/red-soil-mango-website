import React from 'react';
import Header from './components/Header';
import HomeContent from './components/HomeContent';
import Footer from './components/Footer';
import './App.css';

const MainPage: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <div className="navigation-line"></div>
      <HomeContent />
      <div className="footer-line"></div>
      <Footer />
    </div>
  );
};

export default MainPage;
