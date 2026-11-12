
import React, { useEffect, useState } from "react";
import styles from "./LevelRoadmap.module.css";
import { levelData } from "../../data/levelData";

const XP_KEY = "velLoopXP";

function LevelRoadmap() {

    // Get XP from localStorage
    const [totalXP, setTotalXP] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        return savedXP !== null
            ? Number(savedXP)
            : levelData.initialXP;
    });

    // Update roadmap whenever mini-game XP changes
    useEffect(() => {

        const updateXP = (event) => {
            const updatedXP = Number(event.detail?.xp ?? 0);
            setTotalXP(updatedXP);
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener("velLoopXPUpdated", updateXP);
        };

    }, []);

    // Get levels from levelData.js
    const levels = levelData.levels;

    // Find current level
    const currentLevel = [...levels]
        .reverse()
        .find((level) => totalXP >= level.requiredXP) || levels[0];

    // Find next level
    const nextLevel = levels.find(
        (level) => level.level === currentLevel.level + 1
    );

    return (
        <div className={styles.roadmap}>

            {/* Roadmap Heading */}
            <div className={styles.heading}>
                <div>
                    <p>YOUR JOURNEY</p>
                    <h2>Level Progression Roadmap</h2>
                </div>

                <span>{levels.length} Levels</span>
            </div>

            {/* Level Cards */}
            <div className={styles.levelList}>

                {levels.map((level) => {

                    const isCompleted =
                        level.level < currentLevel.level;

                    const isCurrent =
                        level.level === currentLevel.level;

                    const isLocked =
                        level.level > currentLevel.level;

                    // Apply CSS status classes
                    const statusClass = isCompleted
                        ? styles.completed
                        : isCurrent
                        ? styles.current
                        : styles.locked;

                    return (

                        <div
                            className={`${styles.levelItem} ${statusClass}`}
                            key={level.level}
                        >

                            {/* Level Number */}
                            <div className={styles.levelNumber}>
                                {isCompleted
                                    ? "✓"
                                    : `0${level.level}`}
                            </div>

                            {/* Level Information */}
                            <div className={styles.levelDetails}>
                                <h3>{level.name}</h3>

                                <p>
                                    {level.requiredXP.toLocaleString("en-IN")} XP
                                </p>
                            </div>

                            {/* Level Status */}
                            <span className={styles.status}>
                                {isCurrent
                                    ? "CURRENT"
                                    : isCompleted
                                    ? "COMPLETED"
                                    : level.level === nextLevel?.level
                                    ? "NEXT"
                                    : "LOCKED"}
                            </span>

                        </div>

                    );
                })}

            </div>

            {/* Next Level Information */}
            {nextLevel ? (

                <p>
                    Earn{" "}
                    {Math.max(
                        0,
                        nextLevel.requiredXP - totalXP
                    ).toLocaleString("en-IN")}{" "}
                    more XP to reach Level {nextLevel.level}.
                </p>

            ) : (

                <p>
                    Congratulations! You have reached the highest level.
                </p>

            )}

        </div>
    );
}

export default LevelRoadmap;
