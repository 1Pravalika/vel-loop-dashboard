import { Award, Sparkles } from "lucide-react";
import { formatReward, rewardForLevel } from "../data/rewards.js";
import Modal from "./Modal.jsx";
import styles from "./levelUpModal.module.css";

export function LevelUpModal({ level, onClose }) {
  if (!level) return null;
  const reward = rewardForLevel(level.number);

  return (
    <Modal title="Milestone reached" onClose={onClose} accent>
      <div className={styles.celebration}>
        <div className={styles.badge}><Award size={38} strokeWidth={1.4} /></div>
        <span className={styles.kicker}><Sparkles size={14} /> DEMO ACHIEVEMENT UNLOCKED</span>
        <h3>Level {String(level.number).padStart(2, "0")}</h3>
        <p className={styles.levelName}>{level.title}</p>
        <div className={styles.reward}>
          <span>Next-level demo reward</span>
          <strong>{formatReward(reward)}</strong>
        </div>
        <p className={styles.note}>
          This local celebration uses illustrative demo values. Reward processing is not connected.
        </p>
        <button className={styles.continueButton} onClick={onClose}>Continue</button>
      </div>
    </Modal>
  );
}
