import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import GameArena from "../components/GameArena.jsx";
import { formatNumber } from "../data/levels.js";
import styles from "./game.module.css";
import ui from "../styles/ui.module.css";

export default function GamePage() {
  const rewards = useOutletContext();

  function handleComplete(matchedPairs) {
    if (matchedPairs >= 6) {
      rewards.recordActivity({
        label: "Reward Match",
        detail: `${matchedPairs} pairs matched · demo reward`,
        xp: 25,
        coins: 5,
      });
    } else if (matchedPairs > 0) {
      rewards.recordActivity({
        label: "Reward Match practice",
        detail: `${matchedPairs} pairs matched · participation demo reward`,
        xp: 5,
      });
    } else {
      rewards.showNotice("No pairs matched this round. Try again when you’re ready.");
    }
  }

  return (
    <div className={ui.page}>
      <div className={styles.gameHeading}>
        <Link to="/earn" className={styles.backLink}><ArrowLeft size={14} /> All earning activities</Link>
        <span className={ui.eyebrow}>A QUICK MEMORY CHALLENGE</span>
        <h1>Play & Earn</h1>
        <p>Match the reward symbols, beat the timer and see your demo reward land in your wallet.</p>
        <div className={styles.quickStats}>
          <span><Gamepad2 size={14} /> Reward Match</span>
          <span>Current XP: {formatNumber(rewards.data.xp)}</span>
          <span>Reward is demo-only</span>
        </div>
      </div>
      <div className={styles.gameLayout}>
        <GameArena onComplete={handleComplete} />
        <aside className={`${ui.card} ${styles.gameAside}`}>
          <span className={ui.eyebrow}>HOW TO PLAY</span>
          <h2>Quick rules</h2>
          <ol>
            <li>Press Start to begin a 60-second round with 6 pairs.</li>
            <li>Turn over two cards at a time and remember each symbol.</li>
            <li>Match all 6 pairs before time runs out.</li>
          </ol>
          <div className={styles.rewardRules}>
            <strong>Transparent demo rewards</strong>
            <span>6 pairs matched · +25 XP and +5 VE</span>
            <span>1–5 pairs matched · +5 XP participation</span>
            <span>0 pairs matched · no reward</span>
          </div>
          <p>Unlimited practice rounds. Demo rewards are stored locally only and do not represent official VELOOP reward rules.</p>
        </aside>
      </div>
    </div>
  );
}
