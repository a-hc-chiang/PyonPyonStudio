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
                    character: "Angela",
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
                    character: "Angela",
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
                    character: "Angela",
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
                    character: "Angela",
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
                    character: "Angela",
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
                    character: "Angela",
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
                    { xPos: 500, yPos: 100 }
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
                    className="background-image"
                    style={{backgroundImage: `url(${sprite.url})`,}}
                />
            );
        }

        if (sprite.spriteType === "textboxSprite") {
            return (
                <img
                    className={"textbox-sprite"}
                    src={sprite.url}
                    alt="Textbox Sprite"
                />
            );
        }

        if (sprite.spriteType === "regularSprite") {
            return sprite.url.map((url, index) => (
                <img
                    className={"regular-sprite"}
                    key={index}
                    src={url}
                    alt={`Regular Sprite ${index + 1}`}
                    style={{
                        left: sprite.positions[index].xPos,
                        top: sprite.positions[index].yPos
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
                <div className={"game-over"}>
                    <h2>Game Over!</h2>
                    <p>Thank you for playing! Refresh the page to restart.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: "100%", margin: "0px"}}>
            <TopMenu color={"#074A11D4"} />
            <BackgroundMusicMenu/>
            {currentScreen.background &&
                renderSprite(currentScreen.background)}

            {currentScreen.regularSprite &&
                currentScreen.regularSprite.map((spriteId) => renderSprite(spriteId))}


            {currentScreen.textboxInfo.sprite && renderSprite(currentScreen.textboxInfo.sprite)}

            {currentScreen.nextType === "screenId" && (
                <div>
                    <div className={"dialogue-character-name"}>
                        {currentScreen.textboxInfo.character}
                    </div>
                    <div
                        className={"dialogue-content"}
                        onClick={handleDialogueClick}
                    >
                        {currentScreen.textboxInfo.dialogue}
                    </div>
                </div>
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
                                className={"choice-container"}
                                key={choiceId}
                                onClick={() => handleChoiceClick(choiceId)}
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
