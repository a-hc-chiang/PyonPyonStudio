import React from 'react';
import TopMenu from '../shared/TopMenu'
import './Maker.css';

const LandingPage = () => {
  return (
    <div className={"MakerPage"}>
      <TopMenu color={"#df79ce"} />
      <div className={"LPContent"}>
        <div className={"LPLogoContent"}>
          Mascot+Text
        </div>
        <div className={"LPMenuContent"}>
          <div className={"LPGenerateVNButton"}>
            Generate VN
          </div>
          <div className={"LPPlayGameButton"}>
            Play Game
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default LandingPage;
