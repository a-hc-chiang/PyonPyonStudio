import React, { useState, useEffect } from 'react';
import './Maker.css';
import TopMenu from '../shared/TopMenu'
import BottomMenu from './shared/BottomMenu';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate(); 

  const handleGenerateClick = () => {
    navigate('/generate-vn');
  };

  const handlePlayGame = () => {
    navigate('/play-game');
  }

  return (
    <div className={"MakerPage"}>
      <TopMenu color={"#df79ce"} />
      <div className={"LPContent"}>
        <div></div>
        <div className={"LPLogoContent"}>
          <p>Mascot+Text</p>
        </div>
        <div className={"LPMenuContent"}>
          <div className={"LPGenerateVNButton"} onClick={handleGenerateClick}>
            <p>Generate VN</p>
          </div>
          <div className={"LPPlayGameButton"} onClick={handlePlayGame}>
            <p>Play Game</p>
          </div>
        </div> 
        <div></div>

      </div>
      <BottomMenu></BottomMenu>
    </div>
  );
};

export default LandingPage;
