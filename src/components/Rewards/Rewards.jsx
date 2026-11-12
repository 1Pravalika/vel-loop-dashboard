
import React, { useEffect, useState } from "react";
import { levelData } from "../../data/levelData";

const XP_KEY = "velLoopXP";

function Rewards() {
    const [totalXP, setTotalXP] = useState(() => {
        const savedXP = localStorage.getItem(XP_KEY);

        return savedXP !== null
            ? Math.max(0, Number(savedXP) || 0)
            : levelData.initialXP;
    });

    // Listen for XP updates from the mini-game
    useEffect(() => {
        const updateXP = (event) => {
            setTotalXP(
                Math.max(0, Number(event.detail.xp) || 0)
            );
        };

        window.addEventListener("velLoopXPUpdated", updateXP);

        return () => {
            window.removeEventListener("velLoopXPUpdated", updateXP);
        };
    }, []);

    return (
        <div style={styles.container}>
            <p style={styles.subtitle}>YOUR ACHIEVEMENTS</p>
            <h2 style={styles.heading}>Level Rewards</h2>

            <p style={styles.description}>
                Unlock rewards by reaching higher membership levels.
            </p>

            <div style={styles.xpBox}>
                Your Total XP: <strong>{totalXP.toLocaleString("en-IN")} XP</strong>
            </div>

            <div style={styles.rewardGrid}>
                {levelData.levels.map((level) => {
                    const unlocked = totalXP >= level.requiredXP;

                    return (
                        <div
                            key={level.level}
                            style={{
                                ...styles.rewardCard,
                                opacity: unlocked ? 1 : 0.55,
                                borderColor: unlocked ? "#e9bd58" : "#383d50"
                            }}
                        >
                            <div style={styles.badge}>
                                {unlocked ? "🏆" : "🔒"}
                            </div>

                            <p style={styles.level}>
                                LEVEL {String(level.level).padStart(2, "0")}
                            </p>

                            <h3 style={styles.name}>{level.name}</h3>

                            <h2 style={styles.reward}>
                                {level.reward} {level.rewardType || "VEs"}
                            </h2>

                            <p style={styles.required}>
                                Required: {level.requiredXP.toLocaleString("en-IN")} XP
                            </p>

                            <span
                                style={{
                                    ...styles.status,
                                    background: unlocked ? "#244a3b" : "#383d50",
                                    color: unlocked ? "#75e0a7" : "#b6bdce"
                                }}
                            >
                                {unlocked ? "UNLOCKED" : "LOCKED"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: "#1b1e30",
        padding: "25px",
        borderRadius: "16px",
        color: "#ffffff",
        marginTop: "25px"
    },
    subtitle: {
        color: "#e9bd58",
        fontSize: "12px",
        letterSpacing: "2px",
        fontWeight: "bold"
    },
    heading: {
        margin: "8px 0",
        fontSize: "25px"
    },
    description: {
        color: "#aeb4c7"
    },
    xpBox: {
        background: "#252a40",
        padding: "15px",
        borderRadius: "10px",
        margin: "20px 0"
    },
    rewardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px"
    },
    rewardCard: {
        background: "#252a40",
        border: "1px solid",
        borderRadius: "14px",
        padding: "20px",
        textAlign: "center"
    },
    badge: {
        fontSize: "38px",
        marginBottom: "10px"
    },
    level: {
        color: "#e9bd58",
        fontSize: "12px",
        letterSpacing: "1px"
    },
    name: {
        fontSize: "17px",
        margin: "8px 0"
    },
    reward: {
        color: "#f6d477",
        fontSize: "24px"
    },
    required: {
        color: "#aeb4c7",
        fontSize: "12px"
    },
    status: {
        display: "inline-block",
        padding: "7px 13px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "bold",
        marginTop: "10px"
    }
};

export default Rewards;
