import React, { useState, useEffect } from 'react';

const BGMenu = ({ showNext, setShowNext, backgrounds, setBackground }) => {
  const handleAddBackground = () => {
    // const newCharacter = prompt("Enter the name of the new character:");
    // if (newCharacter) {
    //   setCharacters([...characters, newCharacter]); // Add the new character to the list
    // }
  };


  return (
    <div className="BackgroundMenu">
      <h2>BackgroundMenu</h2>
      
      {/* <div>
        <h3>Character List:</h3>
        <ul>
          {characters.length > 0 ? (
            characters.map((character, index) => (
              <li key={index}>{character}</li>
            ))
          ) : (
            <p>No characters added yet!</p>
          )}
        </ul>
      </div>
      
      <div>
        <button onClick={handleAddCharacter}>Add Character</button>
      </div>
      
      <div>
        <button onClick={handleToggleShowNext}>
          {showNext ? "Hide Next" : "Show Next"}
        </button>
      </div> */}
    </div>
  );
};

export default BGMenu;