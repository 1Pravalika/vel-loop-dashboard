
import React, { useState, useEffect } from "react";
import styles from "./LevelDashboard.module.css";

import { levelData } from "../../data/levelData";

import CurrentLevel from "../CurrentLevel/CurrentLevel";
import LevelRoadmap from "../LevelRoadmap/LevelRoadmap";
import Badges from "../Badges/Badges";
import Rewards from "../Rewards/Rewards";
import XPActivity from "../XPActivity/XPActivity";
import MiniGame from "../MiniGame/MiniGame";
import LevelUpCelebration from "../LevelUpCelebration/LevelUpCelebration";
import EarnMoreXP from "../EarnMoreXP/EarnMoreXP";

const XP_KEY = "velLoopXP";

function LevelDashboard() {

    // Get saved XP balance
    const [xp, setXp] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        return savedXP !== null
            ? Math.max(0, Number(savedXP) || 0)
            : levelData.initialXP;
    });

    // Listen for XP updates from MiniGame
    useEffect(() => {
        const updateXP = (event) => {
            setXp(Math.max(0, Number(event.detail?.xp) || 0));
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener(
                "velLoopXPUpdated",
                updateXP
            );
        };
    }, []);

    // Calculate current and next level
    const currentIndex = levelData.levels.reduce(
        (foundIndex, level, index) =>
            xp >= level.requiredXP ? index : foundIndex,
        0
    );

    const nextLevel = levelData.levels[currentIndex + 1];

    return (
        <div className={styles.dashboard}>

            {/* Navigation Bar */}
            <nav className={styles.navbar}>

                <div className={styles.logo}>
                    <span className={styles.logoIcon}>V</span>
                    <h2>VELOOP <span>Rewards</span></h2>
                </div>

                <div className={styles.navLinks}>
                    <a href="#overview">Overview</a>
                    <a href="#levels">My Levels</a>
                    <a href="#rewards">Rewards</a>
                    <a href="#games">Play & Earn</a>
                </div>

                <div className={styles.profile}>
                    <div className={styles.avatar}>U</div>
                    <div>
                        <h4>User</h4>
                        <p>Rewards Member</p>
                    </div>
                </div>

            </nav>

            {/* Dashboard Content */}
            <main className={styles.main} id="overview">

                {/* Welcome Section */}
                <section className={styles.welcome}>

                    <div>
                        <p className={styles.subtitle}>
                            YOUR REWARDS JOURNEY
                        </p>

                        <h1>
                            Level Up Your <span>Rewards</span>
                        </h1>

                        <p className={styles.description}>
                            Keep earning XP, unlock new levels,
                            and discover exciting rewards along the way.
                        </p>
                    </div>

                    <div className={styles.dateCard}>
                        <span>YOUR JOURNEY</span>
                        <h3>Starts Here</h3>
                        <p>Every achievement takes you further.</p>
                    </div>

                </section>

                {/* Total XP Balance */}
                <section className={styles.sectionCard}>
                    <p>YOUR TOTAL XP BALANCE</p>
                    <h2>{xp.toLocaleString("en-IN")} XP</h2>
                    <p>Your accumulated XP from completed challenges.</p>
                </section>

                {/* Current Level */}
                <section id="levels">
                    <CurrentLevel />
                </section>

                {/* Dynamic Next Level Reward */}
                <section className={styles.sectionCard} id="next-reward">

                    <p>YOUR NEXT REWARD</p>

                    {nextLevel ? (
                        <>
                            <h2>
                                {nextLevel.reward}{" "}
                                {nextLevel.rewardType || "VEs"}
                            </h2>

                            <h3>{nextLevel.name} Reward</h3>

                            <p>
                                Reach Level{" "}
                                {String(nextLevel.level).padStart(2, "0")}
                                {" "}with{" "}
                                {nextLevel.requiredXP.toLocaleString("en-IN")} XP
                                to unlock this reward.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>Highest Level Reached!</h2>
                            <p>You have completed all available levels.</p>
                        </>
                    )}

                </section>

                {/* Level Progression Roadmap */}
                <section id="roadmap">
                    <LevelRoadmap />
                </section>

                {/* All Level Rewards */}
                <section id="rewards">
                    <Rewards />
                </section>

                {/* Badges and Achievements */}
                <section id="badges">
                    <Badges />
                </section>

                {/* XP Activity History */}
                <section id="activity">
                    <XPActivity />
                </section>

                {/* Earn More XP */}
                <section id="earn-more-xp">
                    <EarnMoreXP />
                </section>

                {/* Mini Game */}
                <section id="games">
                    <MiniGame />
                </section>

            </main>

            {/* Automatic Level Up Celebration Popup */}
            <LevelUpCelebration />

        </div>
    );
}

export default LevelDashboard;
