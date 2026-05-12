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
        <h1>The Story of Naturally Ripened Mangoes</h1>
        <p>
          Our preparation for naturally ripened mangoes begins in November and December of the previous year.
          We prune the trees to ensure enough sunlight reaches the center of the canopy.
          During this time, we also collect and burn dry twigs so that any fruit-damaging fungus doesn't survive
          on the farm through the fruiting season. Finally, we do a 'pick and drop' weeding pass with a mini
          rotavator to return organic matter to the soil.
        </p>
      </div>

      {/* Foiler Spray Section */}
      <div className="foiler-section">
        <div className="foiler-text">
          <p>
            At the start of the flowering season in late January, we spray neem oil for fungus protection and
            jeevamrutham to help the tree draw nutrients for its flowers and fruits. Both are mixed with water
            at a 3:1000 ratio. Jeevamrutham is readily available if we order a week in advance from the nearby
            KVK in Algole village. Neem oil is usually available at the Sangham Co-operative Oil Mill, run by
            local women in Algole village under the guidance of DDS, Pastapur, Zaheerabad. Hot days and cooler
            nights are ideal conditions for the flowers to progress comfortably to the fruiting stage. Our
            region in Telangana (close to Bidar) is specifically known for this combination of day–night
            climatic conditions.
          </p>
        </div>
        <div className="foiler-image">
          <img src={foilerSprayImage} alt="Foliar spray application on a mango tree" />
        </div>
      </div>

      {/* Calcium & Fruitfly Section */}
      <div className="paragraph3">
        <p>
          Once fruit-setting begins and the fruits reach a reasonable size around the end of March, we apply
          calcium and potassium so the fruit stays firm and has a longer shelf life after harvest.
          For calcium, we use river shells soaked in vinegar for around five days. For potassium, we use
          tobacco stems fermented in jaggery for around seven days. These bio-inputs are mixed with water
          at a 3:1000 ratio and sprayed on alternate days. A hailstorm during this period can damage the
          fruiting, and the thick band of tall trees and shrubs along the boundary helps protect against it.
          To avoid fruit fly infestation, we use fruit fly traps with an inoculant that catches male flies
          throughout the harvesting season.
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
          Our fruits are usually ready to pluck around mid-May, a little later than the rest of the mango
          orchards in the region. We harvest gradually — picking only the larger, matured fruits in the first
          round — and as the season progresses, we pluck all the fruits over a period of fifteen days.
          Each fruit is hand-picked with its stalk intact so the sap doesn't spill. The fruits are then dried
          in the open for two days, allowing the sap to settle and the fruit to firm up. Next, they are cleaned
          with a 5% vinegar solution for 5 minutes to remove dirt, sap, and unwanted pathogens from the skin.
          Finally, we dry them with a cloth and pack them in crates with rice hay, to be kept in an airtight
          room for two days.
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
        <img src={mangoHarvestImage} alt="Freshly harvested mangoes" />
        <p>
          The fruits are kept in an airtight room for two days to trigger the ripening process.
          After this, they are moved to open space to continue ripening, but at a slower rate.
          During this time, we also sift out any damaged mangoes. Once the mangoes are about 80% ripe,
          we send them to our friends and customers. It takes around ten days from the time a mango is
          plucked for it to fully ripen. Throughout this post-harvest period, we keep track of damaged
          fruits and dispose of them carefully — we dig a rectangular pit and bury them one foot deep
          with five inches of soil on top. There is usually about 20% wastage, depending on many factors
          such as rain during harvesting, and the presence of dry twigs or rotten fruits on the farm.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default MangoPage;
export {};
