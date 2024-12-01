import React, { useState, useEffect } from 'react';
import './Maker.css';

import TopMenu from '../shared/TopMenu';
import BottomMenu from './shared/BottomMenu';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect after component mounts
    setFadeIn(true);
  }, []); 

  const handleGenerateClick = () => {
    navigate('/generate-vn');
  };

  return (
    <div className="MakerPage">
      <TopMenu color="#df79ce" />
      <div className={`LPContent ${fadeIn ? 'fade-in' : ''}`}>
        <div></div>
        <div
          style={{ backgroundImage: "url('/Pyon-chan.png')" }}
          className="LPLogoContent"
        ></div>
        <div className="LPMenuContent">
          <div
            className="LPGenerateVNButton darumadrop-one-regular"
            onClick={handleGenerateClick}
          >
            <p>Generate VN</p>
          </div>
          <div className="LPPlayGameButton darumadrop-one-regular">
            <p>Play Game</p>
          </div>
        </div>
        <div></div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default LandingPage;
