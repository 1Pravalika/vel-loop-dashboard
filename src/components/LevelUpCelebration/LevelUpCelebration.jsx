
import React, { useState, useEffect } from "react";
import styles from "./LevelUpCelebration.module.css";
import { levelData } from "../../data/levelData";

const XP_KEY = "velLoopXP";
const CELEBRATED_KEY = "velLoopCelebratedLevel";

function getCurrentLevel(xp) {
    const levels = levelData.levels;

    let currentLevel = levels[0];

    levels.forEach((level) => {
        if (xp >= level.requiredXP) {
            currentLevel = level;
        }
    });

    return currentLevel;
}

function LevelUpCelebration() {
    const [showCelebration, setShowCelebration] = useState(false);
    const [unlockedLevel, setUnlockedLevel] = useState(null);

    useEffect(() => {
        const initialXP = Number(
            localStorage.getItem(XP_KEY) ?? levelData.initialXP
        );

        const initialLevel = getCurrentLevel(initialXP);

        // Set the current level when the component first loads.
        if (!localStorage.getItem(CELEBRATED_KEY)) {
            localStorage.setItem(
                CELEBRATED_KEY,
                String(initialLevel.level)
            );
        }

        const handleXPUpdate = (event) => {
            const updatedXP = Number(event.detail?.xp ?? 0);
            const newLevel = getCurrentLevel(updatedXP);
            const previousLevel = Number(
                localStorage.getItem(CELEBRATED_KEY) ??
                initialLevel.level
            );

            if (newLevel.level > previousLevel) {
                setUnlockedLevel(newLevel);
                setShowCelebration(true);

                localStorage.setItem(
                    CELEBRATED_KEY,
                    String(newLevel.level)
                );
            }
        };

        window.addEventListener("velLoopXPUpdated", handleXPUpdate);

        return () => {
            window.removeEventListener(
                "velLoopXPUpdated",
                handleXPUpdate
            );
        };
    }, []);

    const previewCelebration = () => {
        const xp = Number(
            localStorage.getItem(XP_KEY) ?? levelData.initialXP
        );

        const currentLevel = getCurrentLevel(xp);
        const nextLevel =
            levelData.levels.find(
                (level) => level.level > currentLevel.level
            ) || currentLevel;

        setUnlockedLevel(nextLevel);
        setShowCelebration(true);
    };

    const closeCelebration = () => {
        setShowCelebration(false);
    };

    return (
        <div className={styles.container}>
            <p className={styles.subtitle}>SPECIAL ACHIEVEMENT</p>

            <h2>Ready to Level Up?</h2>

            <p>
                Celebrate your progress and unlock new achievements.
            </p>

            <button
                className={styles.previewButton}
                onClick={previewCelebration}
            >
                Preview Celebration
            </button>

            {showCelebration && unlockedLevel && (
                <div className={styles.overlay}>
                    <div
                        className={styles.celebration}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="celebration-title"
                    >
                        <button
                            className={styles.closeButton}
                            onClick={closeCelebration}
                            aria-label="Close celebration"
                        >
                            ×
                        </button>

                        <div className={styles.trophy}>🏆</div>

                        <p className={styles.subtitle}>
                            SPECIAL ACHIEVEMENT UNLOCKED
                        </p>

                        <h1 id="celebration-title">
                            Congratulations!
                        </h1>

                        <h2>Level {unlockedLevel.level} Unlocked!</h2>

                        <p>
                            You reached {unlockedLevel.name} status.
                        </p>

                        <strong>
                            {unlockedLevel.reward}{" "}
                            {unlockedLevel.rewardType || "VEs"} Reward
                        </strong>

                        <button
                            className={styles.continueButton}
                            onClick={closeCelebration}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LevelUpCelebration;
