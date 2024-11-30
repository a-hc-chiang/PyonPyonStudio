import React, { useState, useEffect } from 'react';

const CharacterMenu = ({ showNext, setShowNext, characters, setCharacters }) => {
  const handleAddCharacter = () => {
    const newCharacter = prompt("Enter the name of the new character:");
    if (newCharacter) {
      setCharacters([...characters, newCharacter]); // Add the new character to the list
    }
  };

  const handleToggleShowNext = () => {
    setShowNext(!showNext); // Toggle the `showNext` state
  };

  return (
    <div className="CharacterMenu">
      <h2>Character Menu</h2>
      
      <div>
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
      </div>
    </div>
  );
};

export default CharacterMenu;