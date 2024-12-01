import React, { useState, useEffect } from "react";

const GameInfoMenu = ({ showNext, setShowNext, gameInfo, setGameInfo }) => {
  const [setting, setSetting] = useState("");
  const [playTime, setPlayTime] = useState(30);
  const [numDecisions, setNumDecisions] = useState(2);
  const [callFeature, setCallFeature] = useState(false);
  const [additionalFeatures, setAdditionalFeatures] = useState("");

  useEffect(() => {
    setGameInfo({
      setting,
      playTime,
      numDecisions,
      callFeature,
      additionalFeatures,
    });
  }, [setting, playTime, numDecisions, callFeature, additionalFeatures]);

  useEffect(() => {
    setShowNext(true);
  }, []);



  return (
    <div className="GameInfoMenu">

      {/* Setting Dropdown */}
      <div className="form-group">
        <label htmlFor="setting">Setting:</label>
        <select
          id="setting"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
        >
          <option value="" disabled>
            Select a setting
          </option>
          <option value="fantasy">Fantasy</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="modern">Modern</option>
          <option value="historical">Historical</option>
        </select>
      </div>

      {/* Playtime Input */}
      <div className="form-group">
        <label htmlFor="playTime">Play Time (minutes):</label>
        <input
          id="playTime"
          type="number"
          value={playTime}
          onChange={(e) => setPlayTime(parseInt(e.target.value, 10) || 0)}
        />
      </div>

      {/* Number of Decisions Input */}
      <div className="form-group">
        <label htmlFor="numDecisions">Number of Decisions:</label>
        <input
          id="numDecisions"
          type="number"
          value={numDecisions}
          onChange={(e) => setNumDecisions(parseInt(e.target.value, 10) || 0)}
        />
      </div>

      {/* Call Feature Toggle */}
      <div className="form-group">
        <label>Call Feature:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="callFeature"
              value={true}
              checked={callFeature === true}
              onChange={() => setCallFeature(true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="callFeature"
              value={false}
              checked={callFeature === false}
              onChange={() => setCallFeature(false)}
            />
            No
          </label>
        </div>
      </div>

      {/* Additional Features Textarea */}
      <div className="form-group">
        <label htmlFor="additionalFeatures">Additional Features:</label>
        <textarea
          id="additionalFeatures"
          value={additionalFeatures}
          onChange={(e) => setAdditionalFeatures(e.target.value)}
          rows="4"
        />
      </div>
    </div>
  );
};

export default GameInfoMenu;
