
import React, { useEffect, useState } from "react";
import { levelData } from "../../data/levelData";
import styles from "./CurrentLevel.module.css";

const XP_KEY = "velLoopXP";

function CurrentLevel() {
    const [totalXP, setTotalXP] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        return savedXP !== null
            ? Math.max(0, Number(savedXP) || 0)
            : levelData.initialXP;
    });

    useEffect(() => {
        const updateXP = (event) => {
            setTotalXP(Math.max(0, Number(event.detail.xp) || 0));
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener("velLoopXPUpdated", updateXP);
        };
    }, []);

    // Calculate current level dynamically
    const levels = levelData.levels;

    const currentIndex = levels.reduce(
        (foundIndex, level, index) =>
            totalXP >= level.requiredXP ? index : foundIndex,
        0
    );

    const currentLevelData = levels[currentIndex];
    const nextLevelData = levels[currentIndex + 1];

    const currentLevel = currentLevelData.level;
    const currentLevelName = currentLevelData.name;

    const currentLevelXP = currentLevelData.requiredXP;

    const requiredXP = nextLevelData
        ? nextLevelData.requiredXP
        : currentLevelXP;

    const nextLevel = nextLevelData
        ? nextLevelData.level
        : null;

    // Calculate progress within the current level
    const progress = nextLevelData
        ? Math.min(
            100,
            Math.max(
                0,
                ((totalXP - currentLevelXP) /
                    (requiredXP - currentLevelXP)) * 100
            )
        )
        : 100;

    const remainingXP = nextLevelData
        ? Math.max(requiredXP - totalXP, 0)
        : 0;

    return (
        <div className={styles.levelContainer}>

            <div className={styles.levelHeader}>

                <div className={styles.badge}>
                    <span>
                        {String(currentLevel).padStart(2, "0")}
                    </span>
                </div>

                <div>
                    <p className={styles.label}>CURRENT LEVEL</p>

                    <h2>
                        Level {String(currentLevel).padStart(2, "0")}
                    </h2>

                    <p className={styles.levelName}>
                        {currentLevelName}
                    </p>
                </div>

                <div className={styles.xpValue}>
                    <span>YOUR XP</span>

                    <h2>{totalXP.toLocaleString("en-IN")}</h2>

                    <p>XP Points</p>
                </div>

            </div>

            <div className={styles.progressSection}>

                <div className={styles.progressHeading}>
                    <div>
                        <h3>Level Progress</h3>

                        <p>
                            {Math.min(
                                totalXP - currentLevelXP,
                                requiredXP - currentLevelXP
                            ).toLocaleString("en-IN")}
                            {" / "}
                            {(requiredXP - currentLevelXP)
                                .toLocaleString("en-IN")}
                            {" XP completed"}
                        </p>
                    </div>

                    <strong>{progress.toFixed(2)}%</strong>
                </div>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className={styles.progressInfo}>
                    <span>
                        {currentLevelXP.toLocaleString("en-IN")} XP
                    </span>

                    <span>
                        {requiredXP.toLocaleString("en-IN")} XP
                    </span>
                </div>

            </div>

            <div className={styles.nextLevel}>

                <div>
                    <span>XP NEEDED</span>

                    <h2>
                        {remainingXP.toLocaleString("en-IN")} XP
                    </h2>

                    <p>
                        {nextLevel
                            ? `To reach Level ${nextLevel}`
                            : "Congratulations! Highest level reached."}
                    </p>
                </div>

                <div className={styles.nextBadge}>
                    <span>
                        {nextLevel
                            ? String(nextLevel).padStart(2, "0")
                            : "✓"}
                    </span>

                    <p>
                        {nextLevel ? "NEXT LEVEL" : "COMPLETED"}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default CurrentLevel;
