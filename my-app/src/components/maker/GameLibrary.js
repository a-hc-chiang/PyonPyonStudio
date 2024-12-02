import './Maker.css';
import React, { useState, useEffect } from 'react';
import TopMenu from '../shared/TopMenu';
import BottomMenu from './shared/BottomMenu';
import { useNavigate } from 'react-router-dom'; 

const GameLibrary = () => {
    return(
    <div className="MakerPage">
      <TopMenu color="#df79ce" />
      {/* <div className={`LPContent ${fadeIn ? 'fade-in' : ''}`}> */}
        <div className={"MakerPage"}>
          <div className={"LibraryMenu"}>
            <p>Library</p>
            <div className="grid-container">
              <div>asd</div>
              <div>asd</div>
              <div>asd</div>

            </div>
          </div>
        </div>
      {/* </div> */}
      <BottomMenu />
    </div>
  );
}; 

export default GameLibrary;