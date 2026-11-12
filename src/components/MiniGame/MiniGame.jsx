
import React, { useEffect, useRef, useState } from "react";
import styles from "./MiniGame.module.css";
import { levelData } from "../../data/levelData";

const XP_KEY = "velLoopXP";
const INITIAL_XP = levelData.initialXP;
const XP_PER_TAP = 10;

function MiniGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [seconds, setSeconds] = useState(10);
    const [taps, setTaps] = useState(0);
    const [earnedXP, setEarnedXP] = useState(0);

    // Load saved XP balance
    const [totalXP, setTotalXP] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        if (savedXP === null) {
            localStorage.setItem(XP_KEY, String(INITIAL_XP));
            return INITIAL_XP;
        }

        return Math.max(0, Number(savedXP) || 0);
    });

    const hasAwarded = useRef(false);

    // Listen for XP updates
    useEffect(() => {
        const updateXP = (event) => {
            setTotalXP(
                Math.max(0, Number(event.detail?.xp) || 0)
            );
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener(
                "velLoopXPUpdated",
                updateXP
            );
        };
    }, []);

    // Game timer
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setSeconds((previous) => {
                if (previous <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    // Award XP when game finishes
    useEffect(() => {
        if (seconds !== 0 || hasAwarded.current) return;

        hasAwarded.current = true;
        setIsPlaying(false);

        const gameXP = taps * XP_PER_TAP;

        // Read previous XP balance
        const currentXP = Number(
            localStorage.getItem(XP_KEY) ?? INITIAL_XP
        );

        // Add latest game XP
        const updatedXP = currentXP + gameXP;

        setEarnedXP(gameXP);
        setTotalXP(updatedXP);

        // Save total XP
        localStorage.setItem(
            XP_KEY,
            String(updatedXP)
        );

        // Notify dashboard and LevelUpCelebration
        window.dispatchEvent(
            new CustomEvent("velLoopXPUpdated", {
                detail: {
                    xp: updatedXP,
                    earnedXP: gameXP
                }
            })
        );

    }, [seconds, taps]);

    // Start or replay game
    function startGame() {
        hasAwarded.current = false;

        setTaps(0);
        setEarnedXP(0);
        setSeconds(10);
        setIsPlaying(true);
    }

    // Handle taps
    function handleTap() {
        if (!isPlaying || seconds <= 0) return;

        setTaps((previous) => previous + 1);
    }

    const currentGameXP = taps * XP_PER_TAP;

    return (
        <div className={styles.gameContainer}>

            {/* Game Heading */}
            <div className={styles.gameHeading}>
                <p>PLAY &amp; EARN</p>
                <h2>Quick Tap Challenge</h2>
                <span>Tap fast and earn XP!</span>
            </div>

            {/* Game Statistics */}
            <div className={styles.gameStats}>
                <div>
                    <p>TIME LEFT</p>
                    <h2>{seconds}s</h2>
                </div>

                <div>
                    <p>YOUR TAPS</p>
                    <h2>{taps}</h2>
                </div>

                <div>
                    <p>EARNED XP</p>
                    <h2>{currentGameXP}</h2>
                </div>
            </div>

            {/* Game Buttons */}
            <div className={styles.gamePlay}>
                <button
                    className={styles.tapButton}
                    onClick={handleTap}
                    disabled={!isPlaying}
                >
                    {isPlaying ? "TAP NOW!" : "READY?"}
                </button>

                {!isPlaying && (
                    <button
                        className={styles.startButton}
                        onClick={startGame}
                    >
                        {seconds === 0 ? "Play Again" : "Start Game"}
                    </button>
                )}
            </div>

            {/* Game Result */}
            {seconds === 0 && (
                <div className={styles.result}>
                    <h3>Challenge Completed!</h3>

                    <p>You made {taps} taps.</p>

                    <p>
                        XP earned in this game:
                        <strong> +{earnedXP} XP</strong>
                    </p>

                    <h3>
                        Total Rewards:{" "}
                        {totalXP.toLocaleString("en-IN")} XP
                    </h3>

                    <p>
                        Your game XP has been added to your
                        demo rewards balance.
                    </p>
                </div>
            )}
        </div>
    );
}

export default MiniGame;
