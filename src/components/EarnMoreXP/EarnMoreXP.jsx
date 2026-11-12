
import React, { useState } from "react";
import styles from "./EarnMoreXP.module.css";

const opportunities = [
    {
        icon: "🎯",
        title: "Daily Mission",
        description: "Complete a daily activity and build your rewards journey.",
        details: "Complete one eligible daily task to participate.",
    },
    {
        icon: "🧠",
        title: "Quick Quiz",
        description: "Test your knowledge with a short quiz challenge.",
        details: "Answer a set of questions to complete the quiz concept.",
    },
    {
        icon: "🤝",
        title: "Referral Mission",
        description: "Invite friends and explore referral milestones.",
        details: "This concept depends on the platform's referral rules.",
    },
    {
        icon: "📅",
        title: "Weekly Quest",
        description: "Work towards a weekly achievement goal.",
        details: "Complete a weekly objective to finish this quest concept.",
    },
];

function EarnMoreXP() {
    const [selected, setSelected] = useState(null);

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <div>
                    <p>MORE WAYS TO PROGRESS</p>
                    <h2>Earn More XP</h2>
                    <span>Discover new opportunities on your rewards journey.</span>
                </div>
            </div>

            <div className={styles.cardsGrid}>
                {opportunities.map((item, index) => (
                    <div className={styles.card} key={item.title}>
                        <div className={styles.cardTop}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.status}>COMING SOON</span>
                        </div>

                        <h3>{item.title}</h3>
                        <p>{item.description}</p>

                        <button
                            className={styles.detailsButton}
                            onClick={() =>
                                setSelected(selected === index ? null : index)
                            }
                            aria-expanded={selected === index}
                        >
                            {selected === index ? "Hide Details" : "View Details"}
                        </button>

                        {selected === index && (
                            <div className={styles.details}>
                                {item.details}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EarnMoreXP;
