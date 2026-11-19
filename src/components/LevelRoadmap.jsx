import { Check, LockKeyhole, Sparkles } from "lucide-react";
import { LEVELS } from "../data/levels.js";
import { rewardForLevel, formatReward } from "../data/rewards.js";
import styles from "./levelRoadmap.module.css";
import ui from "../styles/ui.module.css";

export default function LevelRoadmap({ currentLevel, onSelect, compact = false }) {
  return (
    <div className={`${styles.roadmap}${compact ? ` ${styles.compact}` : ""}`}>
      {LEVELS.map((level, index) => {
        const reward = rewardForLevel(level.number);
        const isCurrent = currentLevel.number === level.number;
        const isComplete = currentLevel.number > level.number;
        const isNext = currentLevel.number + 1 === level.number;
        const state = isCurrent ? "current" : isComplete ? "complete" : isNext ? "next" : "locked";
        const StateIcon = isComplete ? Check : state === "locked" ? LockKeyhole : Sparkles;
        return (
          <button
            className={`${styles.level}${styles[state] ? ` ${styles[state]}` : ""}`}
            key={level.number}
            onClick={() => onSelect(level)}
            aria-current={isCurrent ? "step" : undefined}
            aria-label={`Level ${level.number}, ${level.title}, ${state}`}
          >
            <span className={styles.marker}><StateIcon size={16} aria-hidden="true" /></span>
            <span className={styles.levelText}>
              <span className={styles.levelMeta}>
                LEVEL {String(level.number).padStart(2, "0")}
                {isCurrent && <span className={styles.youAreHere}>YOU ARE HERE</span>}
                {isNext && <span className={styles.nextLabel}>NEXT GOAL</span>}
              </span>
              <strong>{level.title}</strong>
              <span className={styles.rewardText}>
                {reward ? formatReward(reward) : "Milestone reward"}
              </span>
            </span>
            <span className={styles.stateText}>
              {isCurrent ? "Current" : isComplete ? "Completed" : isNext ? "Next" : "Locked"}
            </span>
          </button>
        );
      })}
      <p className={`${ui.muted} ${styles.disclaimer}`}>
        Demo roadmap · Milestones and rewards are illustrative, not official VELOOP rules.
      </p>
    </div>
  );
}
