import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import FarmPage from './FarmPage';
import MangoPage from './MangoPage';
import OrderPage from './OrderPage';
import ContactPage from './ContactPage';
import FeedbackPage from './FeedbackPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/farm" element={<FarmPage />} />
        <Route path="/mango" element={<MangoPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
