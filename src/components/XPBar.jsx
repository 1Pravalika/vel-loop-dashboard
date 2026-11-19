import styles from "./xpBar.module.css";
import { formatNumber } from "../data/levels.js";

export default function XPBar({ xp, nextLevel, progress, compact = false }) {
  const target = nextLevel?.minXP ?? xp;
  return (
    <div className={`${styles.wrapper}${compact ? ` ${styles.compact}` : ""}`}>
      <div className={styles.labels}>
        <span>{formatNumber(xp)} XP</span>
        <span>{nextLevel ? `${formatNumber(target)} XP` : "Top level"}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Progress toward the next level"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(xp, target)}
        aria-valuetext={`${progress}% toward ${nextLevel ? `level ${nextLevel.number}` : "the top level"}`}
      >
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.footer}>
        <span>{nextLevel ? `${progress}% complete` : "All levels completed"}</span>
        <span>{nextLevel ? `${formatNumber(Math.max(0, target - xp))} XP to go` : "—"}</span>
      </div>
    </div>
  );
}
