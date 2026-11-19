import { useState } from "react";
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  CircleHelp,
  Flame,
  Gamepad2,
  LockKeyhole,
  Play,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import GameArena from "../components/GameArena.jsx";
import LevelRoadmap from "../components/LevelRoadmap.jsx";
import Modal from "../components/Modal.jsx";
import XPBar from "../components/XPBar.jsx";
import rewardVault from "../assets/reward-vault.svg";
import { formatNumber } from "../data/levels.js";
import { EARNING_OPTIONS } from "../data/earning.js";
import { formatReward, rewardForLevel } from "../data/rewards.js";
import styles from "./levels.module.css";
import ui from "../styles/ui.module.css";

const earningIcons = {
  watch: Play,
  "daily-task": Check,
  refer: UsersRound,
  game: Gamepad2,
  challenge: Target,
  bonus: Sparkles,
  streak: Flame,
};

function isCompleteToday(claims, id) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return claims[id] === today;
}

export default function LevelsPage() {
  const rewards = useOutletContext();
  const { data, levelInfo, showNotice, claimEarning } = rewards;
  const [selectedLevel, setSelectedLevel] = useState(null);
  const nextReward = levelInfo.next ? rewardForLevel(levelInfo.next.number) : null;

  function handleGameComplete(matchedPairs) {
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
      showNotice("No pairs matched this round. Try again when you’re ready.");
    }
  }

  function handleEarning(option) {
    if (option.status === "coming") {
      showNotice(`${option.title}: Coming Soon. ${option.detail}`);
    } else if (option.status === "available") {
      claimEarning(option);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeading}>
        <div>
          <span className={ui.eyebrow}>LEVEL-UP CENTER · DEMO</span>
          <h1>Your next milestone starts here</h1>
          <p>See your progress, preview what’s ahead and find a way to earn your next XP.</p>
        </div>
        <button className={ui.quietButton} onClick={() => showNotice("XP and rewards on this page are illustrative demo configuration.")} aria-label="About levels"><CircleHelp size={15} /> About levels</button>
      </div>

      <section className={styles.levelHeroGrid}>
        <article className={`${ui.card} ${styles.levelHero}`}>
          <div className={styles.heroLead}>
            <div className={styles.heroMedal}><Award size={32} /><span>{String(levelInfo.current.number).padStart(2, "0")}</span></div>
            <div>
              <span className={ui.eyebrow}>YOU ARE HERE · LEVEL {String(levelInfo.current.number).padStart(2, "0")}</span>
              <h2>{levelInfo.current.title}</h2>
              <p>{levelInfo.current.badge} badge · current demo level</p>
            </div>
          </div>
          <div className={styles.heroXP}>
            <div><span>Current XP</span><strong>{formatNumber(data.xp)}</strong></div>
            <div className={styles.toNext}><span>{levelInfo.next ? `XP to Level ${levelInfo.next.number}` : "Roadmap complete"}</span><strong>{levelInfo.next ? formatNumber(levelInfo.xpNeeded) : "—"}</strong></div>
          </div>
          <XPBar xp={data.xp} nextLevel={levelInfo.next} progress={levelInfo.progress} />
          <div className={styles.heroFoot}>
            <span>{levelInfo.next ? `Level ${levelInfo.current.number} → Level ${levelInfo.next.number}` : "Top level reached"}</span>
            <span>{levelInfo.progress}% of next milestone</span>
          </div>
        </article>

        <article className={`${ui.card} ${styles.nextCard}`}>
          <div className={styles.nextCardTop}>
            <span className={ui.eyebrow}>NEXT LEVEL REWARD</span>
            <span className={styles.lockMark}><LockKeyhole size={16} /></span>
          </div>
          {nextReward ? (
            <>
              <span className={styles.levelChip}>LEVEL {String(nextReward.level).padStart(2, "0")} · LOCKED</span>
              <div className={styles.rewardIllustration}>
                <div className={styles.rewardRing}><Sparkles size={27} /></div>
                <img src={rewardVault} alt="" />
              </div>
              <h2>{formatReward(nextReward)}</h2>
              <p>{nextReward.name} is configured as the next demo milestone.</p>
              <span className={styles.unlockText}>Reach Level {nextReward.level} to unlock</span>
              <Link to="/rewards" className={ui.textLink}>Explore rewards <ArrowRight size={14} /></Link>
            </>
          ) : (
            <>
              <h2>Roadmap complete</h2><p>All configured demo milestones have been reached.</p>
              <Link to="/rewards" className={ui.textLink}>Explore rewards <ArrowRight size={14} /></Link>
            </>
          )}
        </article>
      </section>

      <section className={`${ui.card} ${ui.cardPad}`}>
        <div className={styles.sectionHeading}>
          <div><span className={ui.eyebrow}>YOUR PATH FORWARD</span><h2>Level progression roadmap</h2></div>
          <span className={styles.roadmapHint}>Select any level for details <ChevronRight size={13} /></span>
        </div>
        <LevelRoadmap currentLevel={levelInfo.current} onSelect={setSelectedLevel} />
        <div className={styles.roadmapRewards}>
          <div className={styles.sectionHeading}>
            <div><span className={ui.eyebrow}>MILESTONES AHEAD</span><h2>Reward roadmap</h2></div>
            <Link to="/rewards" className={ui.textLink}>All rewards <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.rewardRoadmap}>
            {[
              levelInfo.current.number - 1,
              levelInfo.current.number,
              levelInfo.current.number + 1,
            ]
              .filter((number) => number > 0)
              .map((number) => {
                const reward = rewardForLevel(number);
                if (!reward) return null;
                const unlocked = levelInfo.current.number >= number;
                return (
                  <div className={`${styles.rewardStop}${unlocked ? ` ${styles.rewardUnlocked}` : ""}`} key={reward.id}>
                    <span className={styles.rewardStopIcon}>{unlocked ? <Award size={16} /> : <LockKeyhole size={15} />}</span>
                    <span><small>LEVEL {String(number).padStart(2, "0")}</small><strong>{reward.name}</strong><em>{formatReward(reward)}</em></span>
                    <span className={styles.stopStatus}>{unlocked ? "Unlocked" : "Next"}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <section className={styles.engagementGrid}>
        <GameArena onComplete={handleGameComplete} />
        <section className={`${ui.card} ${ui.cardPad} ${styles.activityPanel}`}>
          <div className={styles.sectionHeading}>
            <div><span className={ui.eyebrow}>YOUR LATEST PROGRESS</span><h2>Recent XP activity</h2></div>
            <Link to="/wallet" className={ui.textLink}>Full history <ArrowRight size={13} /></Link>
          </div>
          {data.activity.length ? (
            <div className={styles.activityList}>
              {data.activity.slice(0, 5).map((activity) => (
                <div className={styles.activityItem} key={activity.id}>
                  <span className={styles.activityIcon}><Zap size={15} /></span>
                  <span className={styles.activityCopy}>
                    <strong>{activity.label}</strong>
                    <small>{activity.detail} · {activity.at}</small>
                  </span>
                  <span className={styles.activityXP}>+{activity.xp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={ui.emptyState}>
              <Zap size={20} />
              <h3>Your XP journey starts here</h3>
              <p>Complete an earning activity to see progress here.</p>
              <Link to="/earn" className={ui.textLink}>Start earning XP <ArrowRight size={13} /></Link>
            </div>
          )}
        </section>
      </section>

      <section className={styles.earnSection}>
        <div className={styles.earnHeading}>
          <div>
            <span className={ui.eyebrow}>KEEP YOUR MOMENTUM</span>
            <h2>Earn more XP &amp; rewards</h2>
            <p>{levelInfo.next ? `${formatNumber(levelInfo.xpNeeded)} demo XP remain until Level ${levelInfo.next.number}. Choose an available activity below.` : "Explore demo activities and rewards."}</p>
          </div>
          <Link to="/earn" className={ui.textLink}>All activities <ArrowRight size={14} /></Link>
        </div>
        <div className={styles.earningGrid}>
          {EARNING_OPTIONS.map((option) => {
            const Icon = earningIcons[option.id] ?? Sparkles;
            const completed = option.status === "available" && isCompleteToday(data.claims, option.id);
            return (
              <article className={`${ui.card} ${styles.earningCard}`} key={option.id}>
                <span className={`${styles.earningIcon}${option.status === "coming" ? ` ${styles.comingIcon}` : ""}`}>
                  <Icon size={17} />
                </span>
                <div className={styles.earningText}>
                  <div className={styles.earningTitle}>
                    <strong>{option.title}</strong>
                    {option.status === "coming" ? (
                      <span className={ui.statusTag}>COMING SOON</span>
                    ) : completed ? (
                      <span className={`${ui.statusTag} ${ui.statusTagGreen}`}>DONE TODAY</span>
                    ) : option.status === "link" ? (
                      <span className={`${ui.statusTag} ${ui.statusTagGreen}`}>PLAYABLE</span>
                    ) : (
                      <span className={ui.statusTag}>DEMO</span>
                    )}
                  </div>
                  <p>{option.description}</p>
                  <small>
                    {option.status === "available"
                      ? `+${option.xp} demo XP${option.coins ? ` · +${option.coins} demo VE` : ""}`
                      : option.status === "link"
                        ? "Memory challenge · demo reward"
                        : "Concept · not connected"}
                  </small>
                </div>
                {option.status === "link" ? (
                  <Link className={styles.earningAction} to="/game" aria-label="Play Reward Match"><ArrowRight size={15} /></Link>
                ) : (
                  <button
                    className={styles.earningAction}
                    onClick={() => handleEarning(option)}
                    disabled={completed}
                    aria-label={completed ? `${option.title} completed today` : option.status === "coming" ? `Learn about ${option.title}` : option.actionLabel}
                  >
                    {completed ? <Check size={15} /> : <ArrowRight size={15} />}
                  </button>
                )}
              </article>
            );
          })}
        </div>
        <p className={styles.earnDisclaimer}>All activities, XP amounts and rewards on this page are illustrative local demo values. Unsupported features are marked Coming Soon.</p>
      </section>

      {selectedLevel && (() => {
        const reward = rewardForLevel(selectedLevel.number);
        const isCurrent = selectedLevel.number === levelInfo.current.number;
        const isCompleted = selectedLevel.number < levelInfo.current.number;
        return (
          <Modal title={`Level ${String(selectedLevel.number).padStart(2, "0")}`} onClose={() => setSelectedLevel(null)}>
            <div className={styles.levelDetails}>
              <span className={styles.detailBadge}><Award size={24} /></span>
              <strong>{selectedLevel.title}</strong>
              <span className={ui.muted}>{selectedLevel.badge} badge · {formatNumber(selectedLevel.minXP)} XP milestone</span>
              <div className={styles.detailReward}><span>Configured demo reward</span><strong>{formatReward(reward)}</strong></div>
              <span className={styles.detailStatus}>
                {isCurrent ? "You are at this level now." : isCompleted ? "This level is complete." : "This level is locked in the demo roadmap."}
              </span>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
