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
          <h3 className="farm-heading">About Our Farm</h3>
          <p>
            It is a small four-acre mango orchard with around 250 mango trees of the Benishan/Banganapalle variety.
            Geographically, the farm sits at a lower altitude than the surrounding landscape. It rests on 20 feet of
            deep red-clay soil over a laterite rock deposit, while the surrounding area is rocky with only a shallow
            layer of soil. The east side of the farm is protected from north-easterly winds by tall teak trees and
            wildly grown shrubs along the boundary. A dried-up rainwater runoff stream also runs along the eastern edge.
          </p>
          <p>
            The trees are home to many bird species and honey bees, thanks to the absence of any pesticides or
            chemicals for many years now. Langurs visit the farm to rest at night in the tall teak trees and forage
            on leaves and mango fruits as they pass through the area.
          </p>
          <p>
            There is a 30-year-old open well with a water level around 20 feet deep, which rises and falls with the
            groundwater levels in the area. We don't have any irrigation system — the trees depend entirely on rain
            and the shallow groundwater table for their water needs.
          </p>
        </div>
        <div className="farm-image-container">
          <img
            src={farmImage}
            alt="Mango trees and red soil at our farm"
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
