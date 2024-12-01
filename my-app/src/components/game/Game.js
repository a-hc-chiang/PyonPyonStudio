import React, { useState } from 'react';
import './Game.css';
import TopMenu from '../shared/TopMenu';
import BackgroundMusicMenu from "./BackgroundMusic";

const GameLogic = () => {
    const gameData = {
        game: [
            {
                screenId: 1,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "Hi there! Welcome to the most exciting adventure of your life. Ready to dive in?",
                    sprite: 1
                },
                background: 2,
                regularSprite: [3],
                nextType: "screenId",
                nextScreen: 2
            },
            {
                screenId: 2,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "You look amazing today! Let me show you something special.",
                    sprite: 1
                },
                background: 2,
                regularSprite: [3],
                nextType: "screenId",
                nextScreen: 3
            },
            {
                screenId: 3,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "I was wondering… Are you ready to explore what’s in my world?",
                    sprite: 1
                },
                background: 2,
                regularSprite: null,
                nextType: "choiceId",
                nextScreen: [1, 2]
            },
            {
                screenId: 4,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "Are you a magician? Because every time I look at you, everyone else disappears.",
                    sprite: 1
                },
                background: 2,
                regularSprite: null,
                nextType: "choiceId",
                nextScreen: [3, 4]
            },
            {
                screenId: 5,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "Congrats! You just unlocked the key to my heart.",
                    sprite: 1
                },
                background: 2,
                regularSprite: [3],
                nextType: "screenId",
                nextScreen: 6
            },
            {
                screenId: 6,
                textboxInfo: {
                    character: "Hot Guy",
                    dialogue: "The game is over. But you know what’s not over? My love for you.",
                    sprite: 1
                },
                background: 2,
                regularSprite: [3],
                nextType: "screenId",
                nextScreen: 7,
            },
            {
                screenId: 7,
                textboxInfo: {
                    character: null,
                    dialogue: null,
                    sprite: null,
                },
                background: 4,
                regularSprite: null,
                nextType: null,
                nextScreen: null
            }
        ],
        choices: [
            { choiceId: 1, choiceText: "Explore your heart", nextScreen: 5 },
            { choiceId: 2, choiceText: "Stay lost in your eyes", nextScreen: 6 },
            { choiceId: 3, choiceText: "Let’s see the magic", nextScreen: 5 },
            { choiceId: 4, choiceText: "Disappearing sounds fun!", nextScreen: 6 },
            { choiceId: 5, choiceText: "Tell me more about you", nextScreen: 3 },
            { choiceId: 6, choiceText: "Are you always this smooth?", nextScreen: 4 }
        ],
        sprites: [
            {
                spriteId: 1,
                spriteType: "textboxSprite",
                url: "/characters/testTextboxSprite1.png",
                position: { xPos: 50, yPos: 0 }
            },
            {
                spriteId: 2,
                spriteType: "backgroundImage",
                url: "/backgrounds/test1.jpg",
                position: null
            },
            {
                spriteId: 3,
                spriteType: "regularSprite",
                url: ["/characters/testRegularSprite1.png"],
                positions: [
                    // { xPos: 200, yPos: 100 },
                    { xPos: 700, yPos: 100 }
                ]
            },
            {
                spriteId: 4,
                spriteType: "backgroundImage",
                url: ["/backgrounds/test2.jpg"],
                positions: null,
            }

        ]
    };

    const [currentScreenId, setCurrentScreenId] = useState(1);

    const currentScreen = gameData.game.find((screen) => screen.screenId === currentScreenId);

    const handleDialogueClick = () => {
        if (currentScreen?.nextType === "screenId") {
            setCurrentScreenId(currentScreen.nextScreen);
        }
    };

    const handleChoiceClick = (choiceId) => {
        const selectedChoice = gameData.choices.find((choice) => choice.choiceId === choiceId);
        setCurrentScreenId(selectedChoice.nextScreen);
    };

    const renderSprite = (spriteId) => {
        const sprite = gameData.sprites.find((s) => s.spriteId === spriteId);
        if (!sprite) return null;

        if (sprite.spriteType === "backgroundImage") {
            return (
                <div
                    style={{
                        backgroundImage: `url(${sprite.url})`,
                        backgroundSize: "cover",
                        height: "100vh",
                        width: "100%",
                        zIndex: 1
                    }}
                ></div>
            );
        }

        if (sprite.spriteType === "textboxSprite") {
            return (
                <img
                    src={sprite.url}
                    alt="Textbox Sprite"
                    style={{
                        position: "absolute",
                        left: sprite.position.xPos,
                        bottom: sprite.position.yPos,
                        height: "50%",
                        zIndex: 1000,
                    }}
                />
            );
        }

        if (sprite.spriteType === "regularSprite") {
            return sprite.url.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`Regular Sprite ${index + 1}`}
                    style={{
                        position: "absolute",
                        left: sprite.positions[index].xPos,
                        top: sprite.positions[index].yPos,
                        height: "100vh"
                    }}
                />
            ));
        }
    };

    // when game is over
    if (currentScreen?.nextScreen === null) {
        return (
            <div style={{position: "relative", height: "100vh"}}>
                {currentScreen.background && renderSprite(currentScreen.background)}
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px",
                        position: "absolute", // Ensure this is positioned absolutely
                        top: "50%", // Center vertically
                        left: "50%", // Center horizontally
                        transform: "translate(-50%, -50%)", // Adjust position to center
                        zIndex: 1000, // High enough to be on top
                        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
                        color: "white", // White text for visibility
                        borderRadius: "10px", // Rounded corners
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Shadow for better focus
                        width: "80%", // Ensure it's not too large
                        maxWidth: "500px" // Limit the width
                    }}
                >
                    <h2>Game Over!</h2>
                    <p>Thank you for playing! Refresh the page to restart.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: "100%", margin: "0px"}}>
            <TopMenu color={"#026211D3"} />
            <BackgroundMusicMenu/>
            {currentScreen.background &&
                renderSprite(currentScreen.background)}

            {currentScreen.textboxInfo.sprite && renderSprite(currentScreen.textboxInfo.sprite)}

            {currentScreen.regularSprite &&
                currentScreen.regularSprite.map((spriteId) => renderSprite(spriteId))}

            {currentScreen.nextType === "screenId" && (
                <div
                    onClick={handleDialogueClick}
                    style={{
                        position: "absolute",
                        bottom: "50px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(144, 238, 144, 0.9)",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "80%",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    {currentScreen.textboxInfo.dialogue}
                </div>
                // <div
                //     onClick={handleDialogueClick}
                //     style={{
                //         border: "2px solid black",
                //         padding: "20px",
                //         margin: "20px auto",
                //         width: "80%",
                //         textAlign: "center",
                //         cursor: "pointer",
                //         borderRadius: "10px",
                //         backgroundColor: "#f0f0f0"
                //     }}
                // >
                // </div>
            )}

            {currentScreen.nextType === "choiceId" && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        position: "absolute",
                        top: "30%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10
                    }}
                >
                    {currentScreen.nextScreen.map((choiceId) => {
                        const choice = gameData.choices.find((c) => c.choiceId === choiceId);
                        return (
                            <div
                                key={choiceId}
                                onClick={() => handleChoiceClick(choiceId)}
                                style={{
                                    backgroundColor: "rgba(255, 182, 193, 0.9)",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    width: "50%",
                                    cursor: "pointer",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                {choice.choiceText}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GameLogic;
