
import React, { useEffect, useState } from "react";
import styles from "./XPActivity.module.css";

const ACTIVITY_KEY = "velLoopActivities";

const demoActivities = [
    {
        id: "demo-1",
        name: "Daily Login Bonus",
        date: "Today",
        category: "Engagement",
        xp: 100,
        demo: true
    },
    {
        id: "demo-2",
        name: "Completed Profile",
        date: "Yesterday",
        category: "Achievement",
        xp: 250,
        demo: true
    },
    {
        id: "demo-3",
        name: "Played Daily Challenge",
        date: "Nov 06, 2026",
        category: "Game",
        xp: 150,
        demo: true
    },
    {
        id: "demo-4",
        name: "Referral Completed",
        date: "Nov 05, 2026",
        category: "Referral",
        xp: 500,
        demo: true
    }
];

function XPActivity() {

    const [activities, setActivities] = useState(() => {
        try {
            const saved = localStorage.getItem(ACTIVITY_KEY);
            return saved ? JSON.parse(saved) : demoActivities;
        } catch {
            return demoActivities;
        }
    });

    useEffect(() => {

        const handleXPUpdate = (event) => {
            const earnedXP = Number(event.detail?.earnedXP ?? 0);

            if (earnedXP <= 0) return;

            const newActivity = {
                id: `game-${Date.now()}`,
                name: "Completed Mini Game",
                date: new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                category: "Game",
                xp: earnedXP,
                demo: false
            };

            setActivities((previousActivities) => {
                const updatedActivities = [
                    newActivity,
                    ...previousActivities
                ].slice(0, 10);

                localStorage.setItem(
                    ACTIVITY_KEY,
                    JSON.stringify(updatedActivities)
                );

                return updatedActivities;
            });
        };

        window.addEventListener("velLoopXPUpdated", handleXPUpdate);

        return () => {
            window.removeEventListener(
                "velLoopXPUpdated",
                handleXPUpdate
            );
        };

    }, []);

    return (
        <div className={styles.activityContainer}>

            {/* Heading */}
            <div className={styles.heading}>
                <div>
                    <p>YOUR HISTORY</p>
                    <h2>Recent XP Activity</h2>
                </div>

                <span>XP HISTORY</span>
            </div>

            {/* Activity List */}
            <div className={styles.activityList}>

                {activities.length > 0 ? (

                    activities.map((activity) => (

                        <div
                            className={styles.activityItem}
                            key={activity.id}
                        >

                            {/* Activity Icon */}
                            <div className={styles.activityIcon}>
                                {activity.category === "Game"
                                    ? "🎮"
                                    : activity.category === "Achievement"
                                    ? "🏆"
                                    : activity.category === "Referral"
                                    ? "👥"
                                    : "✦"}
                            </div>

                            {/* Activity Details */}
                            <div className={styles.activityDetails}>
                                <h3>{activity.name}</h3>

                                <p>
                                    {activity.category} · {activity.date}
                                </p>

                                {activity.demo && (
                                    <small>Demo activity</small>
                                )}
                            </div>

                            {/* XP Earned */}
                            <strong>
                                +{activity.xp.toLocaleString("en-IN")} XP
                            </strong>

                        </div>

                    ))

                ) : (

                    <p>No XP activity yet. Start earning XP!</p>

                )}

            </div>
        </div>
    );
}

export default XPActivity;
