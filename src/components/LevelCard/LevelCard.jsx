
import React from "react";
import { levelData } from "../../data/levelData";

function LevelCard() {

  const progress =
    (userData.currentXP / userData.nextLevelXP) * 100;

  return (
    <div className="level-card">

      <h2>Welcome, {userData.name}!</h2>

      <h3>Level {userData.currentLevel}</h3>

      <p>Your Current XP</p>

      <h1>{userData.currentXP} XP</h1>

      <p>
        {userData.nextLevelXP - userData.currentXP} XP
        remaining to next level
      </p>

      <div className="progress-container">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p>{progress.toFixed(1)}% Completed</p>

    </div>
  );
}

export default LevelCard;
