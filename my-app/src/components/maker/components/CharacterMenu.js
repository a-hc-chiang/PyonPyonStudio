import React, { useState, useEffect } from 'react';
import icon from './arrow.png';

const CharacterMenu = ({ showNext, setShowNext, characters, setCharacters }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(null);
  const [highlightedCharacter, setHighlightedCharacter] = useState(null);
  const [isSpriteScreen, setIsSpriteScreen] = useState(false);
  const [, forceUpdate] = React.useState(0);



  const handleAddCharacter = () => {
    const newCharacter = {
      name: "New Character",
      gender: "",
      pronouns: [],
      tropes: [],
      addedInfo: "",
      role: "",
      sprites: [],
    };
    // newCharactersList = [...characters, newCharacter];
    setCharacters([...characters, newCharacter]); // Add the new character to the list
    // setShowNext(false);
    // setIsHighlighted(true);
    // setHighlightedCharacter( newCharacter );
  };

  useEffect(() => {
    setHoveredIndex(null);
    setIsHighlighted(null);
    setHighlightedCharacter(null);
    setShowNext(true);
    setIsSpriteScreen(false);
  }, []);


  const handleEmotionChange = (index, value) => {
    const updatedSprites = [...highlightedCharacter.sprites];
    updatedSprites[index] = { ...updatedSprites[index], emotion: value };
    setHighlightedCharacter({ ...highlightedCharacter, sprites: updatedSprites });
  };

  const handleDeleteSprite = (index) => {
    // Create a new array excluding the sprite at the specified index
    const updatedSprites = highlightedCharacter.sprites.filter((_, i) => i !== index);
    
    // Update the state with the new array
    setHighlightedCharacter({ ...highlightedCharacter, sprites: updatedSprites });
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleAddNewSprite = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newSprite = {
          url: reader.result, // The loaded image as a base64 URL
          emotion: "", // Start with an empty emotion field
        };
        const updatedSprites = [...highlightedCharacter.sprites, newSprite];
        setHighlightedCharacter({ ...highlightedCharacter, sprites: updatedSprites });
      };
      reader.readAsDataURL(file); // Convert image file to base64
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleDelete = (index) => {
    const updatedCharacters = characters.filter((_, i) => i !== index);
    setCharacters(updatedCharacters);
  };

  const changeToHighlighted = (index) => {
    setShowNext(false);
    setIsHighlighted(true);
    setHighlightedCharacter({ ...characters[index], index });
  };

  const handleInputChange = (field, value) => {
    setHighlightedCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePronounChange = (value) => {
    setHighlightedCharacter((prev) => ({
      ...prev,
      pronouns: value.split(",").map((p) => p.trim()),
    }));
  };

  const handleSaveChanges = () => {
    const updatedCharacters = [...characters];
    updatedCharacters[highlightedCharacter.index] = { ...highlightedCharacter };
    setCharacters(updatedCharacters);
    setIsHighlighted(false);
    setShowNext(true);
    // window.location.reload();
    forceUpdate((prev) => prev + 1); // Increment the state to force re-render
  };
  

  return (
    <div className="characterMenu">
      {isHighlighted ? (

        <div className="menu-container">
          <div className="menu-header">
              <button
                className="back-button"
                onClick={() => {
                  setIsHighlighted(false);
                  setShowNext(true);
                }}
              >
              <img src={icon} alt='icon' className='OverlayIconCharacter'></img>
            </button>
          </div>
          <div className="character-card">
            <div className="character-layout">
              <div className="avatar">
                <img
                  src={
                    highlightedCharacter.sprites[0]?.url || null
                  }
               
                />
              </div>
              <div className="outerAlignment">
              {
                isSpriteScreen ? 
                (
                  <div className="sprites">
                    {highlightedCharacter.sprites.map((sprite, index) => (
                      <div key={index}>
                        <div
                          className="background-item"
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                          style={{ backgroundImage: `url(${sprite.url})` }}
                          onClick={() => changeToHighlighted(index)}
                        >
                          {hoveredIndex === index && (
                            <div
                              className="delete-icon"
                              onClick={(event) => {
                                event.stopPropagation(); // Prevents triggering the parent's onClick
                                handleDeleteSprite(index);
                              }}
                            >
                              ✖
                            </div>
                          )}
                        </div>

                        {/* Input box for emotion */}
                        <div>
                          <input
                            type="text"
                            placeholder="Enter emotion..."
                            value={sprite.emotion || ''}
                            onChange={(event) => handleEmotionChange(index, event.target.value)}
                            className="emotion-input"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Sprite Button */}
                    <div
                      key={"new"}
                      className="background-item"
                      style={{ backgroundColor: "#DF79CE", fontSize: 50, textAlign: "center", cursor: "pointer" }}
                      onClick={() => document.getElementById("fileInput").click()} // Trigger hidden file input
                    >
                      <p style={{ marginTop: "-15px" }}>+</p>
                    </div>

                    {/* Hidden file input for sprite upload */}
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleAddNewSprite} // Handle new sprite upload
                    />
                  </div>

                ) :
                (
                  <form className="characterMenu character-form">
                    <div className="form-left">
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        id="name"
                        value={highlightedCharacter.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter name"
                      />

                      <label htmlFor="gender">Gender:</label>
                      <input
                        type="text"
                        id="gender"
                        value={highlightedCharacter.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        placeholder="Enter gender"
                      />

                      <label htmlFor="pronouns">Pronouns:</label>
                      <input
                        type="text"
                        id="pronouns"
                        value={highlightedCharacter.pronouns.join(", ")}
                        onChange={(e) => handlePronounChange(e.target.value)}
                        placeholder="Enter pronouns (comma-separated)"
                      />

                      <label htmlFor="tropes">Tropes:</label>
                      <input
                        type="text"
                        id="tropes"
                        value={highlightedCharacter.tropes.join(", ")}
                        onChange={(e) =>
                          handleInputChange(
                            "tropes",
                            e.target.value.split(",").map((t) => t.trim())
                          )
                        }
                        placeholder="Enter tropes (comma-separated)"
                      />

                      <label htmlFor="role">Character Role:</label>
                      <select
                        id="role"
                        value={highlightedCharacter.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                      >
                        <option value="">Select Role</option>
                        <option value="protagonist">Protagonist</option>
                        <option value="rival">Rival</option>
                        <option value="love interest">Love Interest</option>
                        <option value="childhood best friend">Childhood Best Friend</option>
                      </select>
                    </div>

                    <div className="form-right">
                      <label htmlFor="additional-info">Additional Information:</label>
                      <textarea
                        id="additional-info"
                        value={highlightedCharacter.addedInfo}
                        onChange={(e) =>
                          handleInputChange("addedInfo", e.target.value)
                        }
                        placeholder="This character loves books, etc."
                      ></textarea>
                    </div>
                  </form>

                )
              }
            </div>
              
            </div>
            <button className="save-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button className="save-button" onClick={()=> {setIsSpriteScreen(!isSpriteScreen)}} >
              {
                isSpriteScreen ?
                "Character Data" : "Sprites"
              }
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-container">
          {characters.map((char, index) => (
            <div
              key={index}
              className="background-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{ backgroundImage: `url(${char.sprites[0]?.url})` }}
              onClick={() => changeToHighlighted(index)}
            >
              {hoveredIndex === index && (
                <div
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  ✖
                </div>
              )}
            </div>
          ))}
          <div
            key={"new"}
            className="background-item"
            style={{ backgroundColor: "#DF79CE", fontSize:100, textAlign: 'center'}}
            onClick={handleAddCharacter}
          ><p style={{}}>+</p></div>
        </div>
      )}
    </div>
  );
};

export default CharacterMenu;
