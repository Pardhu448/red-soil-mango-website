import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './MangoPage.css';
import foilerSprayImage from './images/foiler-spray.png';
import calciumExtractImage from './images/calcium-extract.png';
import fruitflyTrapImage from './images/fruitfly-trap.png';
import packageWithHayImage from './images/package-with-hay.png';
import vinegarCleaningImage from './images/vinegar-cleaning.png';
import mangoHarvestImage from './images/mango-harvest.png';

const MangoPage: React.FC = () => {
  return (
    <div className="mango-page">
      <Header />

      {/* Story Section */}
      <div className="paragraph1">
        <h1>Story of naturally ripened mangoes...</h1>
        <p>
          Our preparation to get naturally ripened mangoes starts during nov/dec months of the previous year. 
          We prune the trees to make sure that there is enough sunlight through the center of canopy. 
          During this time we also collect and burn dry twigs to make sure fruit-damaging fungus doesn't survive 
          through the fruiting season on the farm premises. And finally we do 'pick and drop' of weeds with a mini 
          rotvator to provide manure to soil.
        </p>
      </div>

      {/* Foiler Spray Section */}
      <div className="foiler-section">
        <div className="foiler-text">
          <p>
            At the beginning of flowering season during late January, we spray neem-oil for fungus protection and 
            jeevamrutham to help tree secure nutrients for its flowers/fruits. Both are mixed at 3:1000 ratio 
            with water. Jeevamrutham is available readily if we order a week before from the nearby KVK in 
            Algole village. Neem-oil is usually available at Sangham Co-operative Oil Mill run by local women 
            in Algole village under the guidance of DDS, Pastapur, Zaheerabad. Hotter day and cooler night is 
            ideal condition for the flowers to proceed to fruiting stage comfortably. Our region in Telangana 
            (closer to Bidar) is specifically known for this combination of the day-night climatic conditions.
          </p>
        </div>
        <div className="foiler-image">
          <img src={foilerSprayImage} alt="Foiler spray application" />
        </div>
      </div>

      {/* Calcium & Fruitfly Section */}
      <div className="paragraph3">
        <p>
          Once the fruit-setting starts and fruits have come to a reasonable size around March end, we apply 
          calcium and potassium for the fruit to remain firm and have a longer shelf life after harvest. 
          For calcium we use river shells soaked in vinegar for around five days. For potassium we use 
          tobacco stems fermented in jaggery for around seven days. These bio-inputs are mixed with water 
          at 3:1000 ratio for spraying on alternate days. Hailstorm during this time will damage the fruiting 
          and thick layer of tall trees/shrubs on the boundary is helpful. To avoid fruit fly infestation 
          we use fruit fly traps with innoculant which can trap male flies throughout the harvesting season.
        </p>
      </div>
      <div className="shellsAndFlies">
        <div className="calciumExtract">
          <img src={calciumExtractImage} alt="Calcium extract preparation" />
        </div>
        <div className="fruitflyTrap">
          <img src={fruitflyTrapImage} alt="Fruitfly trap" />
        </div>
      </div>

      {/* Packaging Section */}
      <div className="paragraph4">
        <p>
          Our fruits are usually matured to pluck around mid-May, little later than rest of the mango orcards in 
          that region. We do harvesting gradually concentrating on only big and matured fruits during first 
          iteration and as the season progresses we pluck all the fruits over a period of fifteen days. 
          Each fruit is hand picked with its stalk to make sure sap doesnt spill. Then it is dried in open 
          space for two days for the sap to sink-in to make the fruit firm. This is followed by cleaning 
          with 5% vinegar solution for 5 min to remove dirt, sap and unwanted pathogens from the skin. 
          Finally we cloth-dry it and package in crates with rice hay to be kept in air tight room for two days.
        </p>
      </div>
      <div className="cleaningAndPackage">
        <div className="packageWithHay">
          <img src={packageWithHayImage} alt="Mangoes packaged with hay" />
        </div>
        <div className="vinegarCleaning">
          <img src={vinegarCleaningImage} alt="Vinegar cleaning process" />
        </div>
      </div>

      {/* Harvesting Section */}
      <div className="harvesting">
        <img src={mangoHarvestImage} alt="Mango harvest" />
        <p>
          It is kept in air tight room for two days to trigger the ripening process. 
          After this it is kept in open space to continue to ripen but at a slower rate.
          During this time we also sift out the damaged mangoes. Once the mangoes are 80 percent 
          ripened we send it to our friends and customers. It will take around ten days from the time 
          it is plucked for a mango to fully ripen. During this entire time of post-harvesting we need to 
          keep track of damaged fruits and dispose off them carefully. We dig a rectangular hole and bury 
          them 1 feet deep with 5 inches of soil on top. Usually there will be a wastage of around 20% depending 
          on many factors like rain during harvesting, presence of dry twigs and rotten fruits on the farm etc.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default MangoPage;
export {};
