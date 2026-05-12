import React from 'react';
import './HomeContent.css';
import farmImage from '../images/farm-image.png';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <div className="content-container">
        <div className="content-section">
          <h2>Who We Are</h2>
          <p>
            We are a family farm with a small landholding of around 4 acres.
            Our desire to work closely with nature and our community led us
            to permaculture, agroecology and natural farming.
          </p>
        </div>

        <div className="content-section">
          <h2>About the Farm</h2>
          <p>
            This farm was nurtured by our grandparents for around 25 years.
            After they passed away, it was left to itself for five years.
            Now, with a better understanding of food systems, we began our
            journey into natural farming five years ago. Today, the land
            holds only mango trees — 35 years old — which we tend with
            bio-inputs.
          </p>
        </div>

        <div className="content-section">
          <h2>Our Mangoes</h2>
          <p>
            For the first time, we want to share our naturally ripened
            mangoes with everyone. The matured fruit is ripened traditionally
            — in hay, without chemicals. You can order mangoes in 3 kg, 5 kg,
            or 10 kg packs, delivered to your home.
          </p>
        </div>
      </div>

      <div className="image-container">
        <img src={farmImage} alt="Mango trees on our family farm" />
      </div>
    </div>
  );
};

export default HomeContent;
