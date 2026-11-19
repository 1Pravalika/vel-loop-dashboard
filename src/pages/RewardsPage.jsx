import { useState } from "react";
import {
  Award,
  Check,
  ChevronRight,
  Compass,
  Gem,
  LockKeyhole,
  Shield,
  Sparkles,
  Vault,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { formatReward } from "../data/rewards.js";
import styles from "./rewards.module.css";
import ui from "../styles/ui.module.css";

const iconMap = {
  sparkles: Sparkles,
  gem: Gem,
  compass: Compass,
  award: Award,
  vault: Vault,
  coins: Gem,
  shield: Shield,
};

export default function RewardsPage() {
  const rewards = useOutletContext();
  const { rewards: catalog, levelInfo, data, claimReward } = rewards;
  const [selectedReward, setSelectedReward] = useState(null);

  return (
    <div className={ui.page}>
      <div className={ui.pageHeading}>
        <div>
          <span className={ui.eyebrow}>MILESTONES & COLLECTIONS</span>
          <h1>Your rewards</h1>
          <p>Explore unlocked badges and upcoming milestones. Everything here is demo-configured.</p>
        </div>
        <span className={ui.statusTag}>DEMO REWARDS</span>
      </div>

      <section className={`${ui.card} ${styles.collectionBanner}`}>
        <div className={styles.bannerIcon}><Award size={24} /></div>
        <div>
          <span className={ui.eyebrow}>YOUR CURRENT BADGE</span>
          <h2>{levelInfo.current.badge}</h2>
          <p>Level {levelInfo.current.number} · {levelInfo.current.title} · illustrative profile badge</p>
        </div>
        <span className={styles.bannerLevel}>LVL {String(levelInfo.current.number).padStart(2, "0")}</span>
      </section>

      <div className={styles.sectionHeading}>
        <div><h2>Milestone collection</h2><p>Claim an unlocked reward once in this local demo.</p></div>
        <span>{catalog.filter((reward) => levelInfo.current.number >= reward.level).length} unlocked</span>
      </div>

      <div className={styles.rewardGrid}>
        {catalog.map((reward) => {
          const Icon = iconMap[reward.icon] ?? Award;
          const locked = levelInfo.current.number < reward.level;
          const claimed = data.claimedRewards.includes(reward.id);
          return (
            <article className={`${ui.card} ${styles.rewardCard}${locked ? ` ${styles.locked}` : ""}`} key={reward.id}>
              <div className={styles.rewardCardTop}>
                <span className={`${styles.rewardIcon}${reward.kind === "badge" ? ` ${styles.badgeIcon}` : ""}`}><Icon size={21} /></span>
                <span className={`${ui.statusTag}${locked ? "" : ` ${ui.statusTagGreen}`}`}>
                  {locked ? <><LockKeyhole size={10} /> LOCKED</> : claimed ? <><Check size={10} /> CLAIMED</> : "UNLOCKED"}
                </span>
              </div>
              <span className={styles.levelLabel}>LEVEL {String(reward.level).padStart(2, "0")}</span>
              <h3>{reward.name}</h3>
              <p>{reward.description}</p>
              <strong className={styles.rewardValue}>{formatReward(reward)}</strong>
              <div className={styles.rewardActions}>
                <button className={ui.quietButton} onClick={() => setSelectedReward(reward)}>
                  Details <ChevronRight size={13} />
                </button>
                {!locked && !claimed && (
                  <button className={ui.primaryButton} onClick={() => claimReward(reward)}>Claim</button>
                )}
                {claimed && <span className={styles.claimedText}><Check size={13} /> In wallet</span>}
              </div>
            </article>
          );
        })}
      </div>

      <p className={styles.disclaimer}>Badges and reward amounts are local development placeholders. They do not represent approved or redeemable VELOOP benefits.</p>

      {selectedReward && (
        <Modal title={selectedReward.name} onClose={() => setSelectedReward(null)}>
          <div className={styles.modalContent}>
            <span className={styles.rewardIcon}><Award size={22} /></span>
            <span className={styles.levelLabel}>LEVEL {String(selectedReward.level).padStart(2, "0")} MILESTONE</span>
            <p>{selectedReward.description}</p>
            <strong>{formatReward(selectedReward)}</strong>
            <span className={ui.muted}>
              {levelInfo.current.number >= selectedReward.level
                ? "This milestone is unlocked in the demo."
                : `Reach level ${selectedReward.level} to unlock this demo milestone.`}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}
