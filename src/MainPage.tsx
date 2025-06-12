import React from 'react';
import Header from './components/Header';
import HomeContent from './components/HomeContent';
import Footer from './components/Footer';
import './App.css';

const MainPage: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  );
};

export default MainPage;
