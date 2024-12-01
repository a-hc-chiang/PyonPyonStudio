import React, { useState, useEffect } from 'react';
import icon from './arrow.png';

const BGMenu = ({ showNext, setShowNext, backgrounds, setBackgrounds }) => {
  const [isHighlighted, setIsHighlighted] = useState(null);
  const [highlightedPrompt, setHighlightedPrompt] = useState("");
  const [highlightedURL, setHighlightedURL] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);


  useEffect(() => {
    setHoveredIndex(null);
    setHighlightedPrompt(null);
    setHighlightedURL(null);
    setShowNext(true);
  }, []);



  useEffect(() => {
    if (isHighlighted) {
      
    } else {

    }

  }, [isHighlighted]);

  const changeToHighlighted = (index) => {
    setShowNext(false);
    setIsHighlighted(true);
    setHighlightedPrompt(backgrounds[index].prompt);
    setHighlightedURL(backgrounds[index].url);
  };

  const changeToAddNew = () => {
    setShowNext(false);
    setIsHighlighted(true);
  };


  const changeToMain = () => {
    setIsHighlighted(false);
    setHighlightedPrompt("");
    setHighlightedURL("");
    setShowNext(true);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleDelete = (index) => {
    const updatedBackgrounds = backgrounds.filter((_, i) => i !== index);
    setBackgrounds(updatedBackgrounds);
  };

  const generateImage = () => {

  };

  const saveImage = () => {

  }

  const handleAddBackground = () => {
    // const newCharacter = prompt("Enter the name of the new character:");
    // if (newCharacter) {
    //   setCharacters([...characters, newCharacter]); // Add the new character to the list
    // }
  };

  useEffect(() => {
    console.log(backgrounds);
  }, []);


  return (
    <div className="BackgroundMenu">
      {
        isHighlighted ?
        (<div className="backButton" onClick = {changeToMain}>
            <img src={icon} alt='icon' className='OverlayIcon'></img>
        </div>)
        : null
        
      }
      {isHighlighted ?
      (
        <div className="image-generator-menu">
          <div className="image-container">
            {highlightedURL ? (
              <img src={highlightedURL} alt="Generated" className="generated-image" />
            ) : (
              <p>No image generated yet.</p>
            )}
          </div>

          <div className="input-container">
            <textarea
              value={highlightedPrompt}
              onChange={(e) => setHighlightedPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            />
            <div className="button-container">
              <button onClick={generateImage}>Generate Image</button>
              <button onClick={saveImage}>Save Image</button>
            </div>
          </div>
        </div>
      ) :
      (
        <div className="grid-container">
          {backgrounds.map((bg, index) => (
            <div
              key={index}
              className="background-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{ backgroundImage: `url(${bg.url})` }}
              onClick={() => changeToHighlighted(index)}
            >
              {hoveredIndex === index && (
                <div className="delete-icon" onClick={(event) => {
                  event.stopPropagation(); // Prevents triggering the parent's onClick
                  handleDelete(index);
                }}>
                  ✖
                </div>
              )}
              
            </div>
            
          ))}
          <div
            key={"new"}
            className="background-item"
            style={{ backgroundColor: "#DF79CE", fontSize: 50, textAlign: 'center'}}
            onClick={() => changeToAddNew()}
          ><p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</p>
            
          </div>
        </div>
      )
      }

      
    </div>
  );
};

export default BGMenu;