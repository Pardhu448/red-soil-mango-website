import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './FarmPage.css';
import farmImage from './images/farm-story-image.png';

const FarmPage: React.FC = () => {
  return (
    <div className="farm-page">
      <Header />
      <div className="navigation-line"></div>
      
      <div className="farm-content">
        <div className="farm-description">
          <h3 className="farm-heading">About our farm ... </h3>
          <p>
            It is a small four acre 35 years old mango orchard with around 250 mango trees of Benishahn/Banginapally variety. 
            Geographically, farm is at a lower altitude compared to the landscape around. It is sitting on a 20 feet deep 
            red-clay soil on top of a laterite rock deposit, while the area surrounding it is rocky with shallow soil deposit. 
            East side of the farm is protected from north-eastern winds by tall teak trees along with wildly grown shrubs 
            across the boundary. There is also a dried up rainwater runoff stream across the eastern boundary.
          </p>
          <p>
            Trees are habitat to many birds species and honey bees due to the absence of any traces of pesticides or chemicals 
            for many years now. Langurs visit the farm to rest at night on tall teak trees and forage on the leaves/mango 
            fruits during their routine voyage through that area.
          </p>
          <p>
            There is a 30 year old open well with around 20 feet deep water level, which goes up and down based on the 
            groundwater levels in the area. We dont have any irrigation system and trees are dependent on rain and shallow 
            ground water table for their water needs.
          </p>
        </div>
        <div className="farm-image-container">
          <img 
            src={farmImage}
            alt="Red Soil Mango Farm" 
            className="farm-image"
          />
        </div>
      </div>

      <div className="footer-line"></div>
      <Footer />
    </div>
  );
};

export default FarmPage;
