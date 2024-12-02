import React, { useState, useEffect } from 'react';
import './Maker.css';
import TopMenu from '../shared/TopMenu'
import BottomMenu from './shared/BottomMenu';
import CharacterMenu from './components/CharacterMenu';
import BGMenu from './components/BGMenu';
import GameInfoMenu from './components/GameInfoMenu';
import { useNavigate } from 'react-router-dom';

const VNCreationPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    // Trigger fade-in after component mounts
    setFadeIn(true);
  }, []);


  const fakeCharacters = [
    {
 
      name: "A.",
      gender: "female",
      pronouns: ["she", "her"],
      tropes: ["tsundere"],
      addedInfo: "into art, business and computer science",
      role: "protagonist",
      sprites: [
        {
          emotion: "happy",
          url: "/characters/A1/A1.png"
        },
        {
          emotion: "amog",
          url: "/characters/A1/A2.png"
        },
        {
          emotion: "angry",
          url: "/characters/A1/A3.png"
        },
        {
          emotion: "love",
          url: "/characters/A1/A4.png"
        }
      ]
    }


  ]; // for testing
  const fakeBackgrounds = [
    {
      url: "/backgrounds/test1.jpg",
      prompt: "skibidi, anime, office, laboratory, medicine, apothecary"
    },
    {
      url: "/backgrounds/test2.jpg",
      prompt: "rizzler, home, base, bedroom, cozy, poggers, rgb, poggers, computer"
    },
    {
      url: "/backgrounds/test3.jpg",
      prompt: "ohio, beach, sunny, day, sand"
    },
    {
      url: "/backgrounds/test4.jpg",
      prompt: "dank, classroom, sunlight, pog champ"
    },
  ]; // for testing

  
  const menus = ["Characters", "Story", "Background Assets"]
  const [currMenuIdx, setCurrMenuIdx ] = useState(0);

  // these get fed into the backend when generate is selected
  const [characters, setCharacters] = useState(fakeCharacters);
  const [gameInfo, setGameInfo] = useState({
    "setting": "",
    "playTime": 30,
    "numDecisions": 2,
    "callFeature": false,
    "additionalFeatures": ""
  });
  const [backgrounds, setBackgrounds] = useState(fakeBackgrounds);
  const [isLoading, setIsLoading] = useState(false);
  const [currMenu, setCurrMenu] = useState(null);
  const [showNext, setShowNext] = useState(true);
  
  const currMenuSelectedStyle = {
    // change what the tab looks like in the menu based on what is selected
    backgroundColor: 'blue', 
  };

  const changeMenuIdx = (idx) => {
    setCurrMenuIdx(idx);
  }

  const handleNextClick =  async() => {
    // go to next or submit depending on what currMenuIdx we are on, save the information here
    if (currMenuIdx == 2){
      console.log("generate with: ");
      console.log({"characters": characters, "backgrounds": backgrounds, "game_info": gameInfo})
      const requestData = {
        characters: characters,
        backgrounds: backgrounds,
        game_info: gameInfo,
      };
      try {
        // Make a POST request to the /generate-game-json-from-scratch endpoint
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:5000/generate-game-json-from-scratch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        // Check if the response is successful
        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          console.log("Generated game status and game JSON:", data);
  
          console.log(data); // Assuming you have a state to store this data
          navigate("/play-game", { state: data.Game });
        } else {
          // Handle the error response
          const errorData = await response.json();
          console.error("Error generating JSONs:", errorData);
          alert("Failed to generate game data");
        }
  
      } catch (error) {
        // Handle the network error or other unexpected errors
        console.error("Error in API request:", error);
        alert("An error occurred while generating game data");
      }
      
      // do something with characters, backgrounds, gameInfo to API
    } else{
      setCurrMenuIdx((currMenuIdx+1) % 3);
    }
  };


  useEffect(() => {
    // set currMenu to be the char creation menu when page loads
  }, []);

  useEffect(() => {
    let tabs = document.getElementsByClassName("VNCreationTab")
    for (let i = 0; i < tabs.length; i++) {
      if (i === currMenuIdx) {
        tabs[i].classList.add("VNCreationTabSelected");
      } else {
        tabs[i].classList.remove("VNCreationTabSelected");
      }
    }
  }, [currMenuIdx]);


  return (
    
    <div className={"MakerPage"}>
      {
        isLoading ? (
          <div id="loading-screen" className="loading-screen">
            <div className="diagonal-stripes"></div>
            <div className="loading-text darumadrop-one-regular">Making the game</div>
          </div> 
        ) : null
      }
      <TopMenu color={"#df79ce"} />
      <div className={`VNCreationMenu ${fadeIn ? "fade-in" : "fade-out"}`}>
        <div className={"VNCreationTopBar"}>
          <div className={"VNCreationTab comic-neue-bold"} onClick={() => {changeMenuIdx(0)}}><p className={"VNCreationTabText"}>Characters</p></div>
          <div className={"VNCreationTab comic-neue-bold"} onClick={() => {changeMenuIdx(1)}}><p className={"VNCreationTabText"}>Story</p></div>
          <div className={"VNCreationTab comic-neue-bold"} onClick={() => {changeMenuIdx(2)}}><p className={"VNCreationTabText"}>Background Assets</p></div>
        </div>
        <div className="VNCreationMenuContent">
          {(() => {
            if (currMenuIdx === 0) {
              return (
                <CharacterMenu 
                  showNext={showNext} 
                  setShowNext={setShowNext} 
                  characters={characters} 
                  setCharacters={setCharacters} 
                />
              );
            } else if (currMenuIdx === 1) {
              return (
                <GameInfoMenu 
                  showNext={showNext} 
                  setShowNext={setShowNext} 
                  gameInfo={gameInfo} 
                  setGameInfo={setGameInfo} 
                />
              );
            } else if (currMenuIdx === 2) {
              return (
                <BGMenu 
                  showNext={showNext} 
                  setShowNext={setShowNext} 
                  backgrounds={backgrounds} 
                  setBackgrounds={setBackgrounds} 
                />
              );
            }
          })()}
        </div>
        {
          showNext ?
          (
            <div className={"VNCreationNext merriweather-sans-300"} onClick={handleNextClick}>
              <p className={"VNCreationNextText darumadrop-one-regular"}>{(currMenuIdx % 3 == 2) ? "Generate?!" : "Next"}</p>
            </div>
          ) : null
        }
      </div>
      
      <BottomMenu></BottomMenu>
    </div>
  );
};

export default VNCreationPage
