
import React, { useEffect, useState } from "react";
import styles from "./Badges.module.css";
import { levelData } from "../../data/levelData";

const XP_KEY = "velLoopXP";

const badges = [
    {
        icon: "🏆",
        name: "First Step",
        description: "Started your rewards journey",
        requiredXP: 1000,
        color: "bronze"
    },
    {
        icon: "⭐",
        name: "XP Collector",
        description: "Earned your first 1,000 XP",
        requiredXP: 2000,
        color: "silver"
    },
    {
        icon: "🔥",
        name: "On Fire",
        description: "Reached 4,000 XP",
        requiredXP: 4000,
        color: "gold"
    },
    {
        icon: "💎",
        name: "Platinum Star",
        description: "Reach Level 05",
        requiredXP: 6000,
        color: "platinum"
    }
];

function Badges() {

    const [totalXP, setTotalXP] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        return savedXP !== null
            ? Number(savedXP)
            : levelData.initialXP;
    });

    useEffect(() => {
        const updateXP = (event) => {
            setTotalXP(Number(event.detail?.xp ?? 0));
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener("velLoopXPUpdated", updateXP);
        };
    }, []);

    const unlockedCount = badges.filter(
        (badge) => totalXP >= badge.requiredXP
    ).length;

    return (
        <div className={styles.badgesContainer}>

            {/* Heading */}
            <div className={styles.heading}>
                <div>
                    <p>YOUR ACHIEVEMENTS</p>
                    <h2>Badges & Achievements</h2>
                </div>

                <span>
                    {unlockedCount} / {badges.length} Unlocked
                </span>
            </div>

            {/* Badge Cards */}
            <div className={styles.badgesGrid}>

                {badges.map((badge) => {

                    const isUnlocked = totalXP >= badge.requiredXP;

                    return (
                        <div
                            className={`${styles.badgeCard} ${
                                isUnlocked ? styles.unlocked : styles.locked
                            }`}
                            key={badge.name}
                        >

                            {/* Badge Icon */}
                            <div
                                className={`${styles.badgeIcon} ${
                                    styles[badge.color]
                                }`}
                            >
                                {isUnlocked ? badge.icon : "🔒"}
                            </div>

                            {/* Badge Information */}
                            <h3>{badge.name}</h3>

                            <p>{badge.description}</p>

                            {/* XP Requirement */}
                            <span className={styles.badgeRequirement}>
                                {badge.requiredXP.toLocaleString("en-IN")} XP
                            </span>

                            {/* Status */}
                            <span className={styles.badgeStatus}>
                                {isUnlocked ? "✓ UNLOCKED" : "LOCKED"}
                            </span>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default Badges;
