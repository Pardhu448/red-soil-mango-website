import React from 'react';
import './HomeContent.css';
import farmImage from '../images/farm-image.png';

const HomeContent: React.FC = () => {
  return (
    <div className="home-content">
      <div className="content-container">
        <div className="content-section">
          <h2>Who we are ?</h2>
          <p>
            We are a family farm with a small land holding of around 4 acres. 
            Our desire to work closely with nature and the communities lead us 
            to Permaculture, Agroecology and Natural Farming
          </p>
        </div>

        <div className="content-section">
          <h2>What about the Farm ?</h2>
          <p>
            This farm was nurtured by our grandparents for around 25 years. 
            After they expired we left it to itself for 5 years. Now with a 
            better understanding of food systems we started our journey into 
            natural farming since 5 years. Right now it has only Mango trees 
            which are 35 years old and are being taken care with bio-inputs
          </p>
        </div>

        <div className="content-section">
          <h2>How about Mangoes ?</h2>
          <p>
            For the first time we wanted to share naturally ripened mangoes 
            with everyone. A traditional ripening of matured fruit is done 
            with hay. You can order mangoes in 3kg, 5kg or 10kg packs which 
            will be delivered to your home
          </p>
        </div>
      </div>

      <div className="image-container">
        <img src={farmImage} alt="Red Soil Mango Farm" />
      </div>
    </div>
  );
};

export default HomeContent;
