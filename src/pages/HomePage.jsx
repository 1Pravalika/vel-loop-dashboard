import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronRight,
  Coins,
  Compass,
  Flame,
  Gamepad2,
  Gem,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import XPBar from "../components/XPBar.jsx";
import { getLevelInfo, formatNumber } from "../data/levels.js";
import { formatReward, rewardForLevel } from "../data/rewards.js";
import styles from "./home.module.css";
import ui from "../styles/ui.module.css";

function balancesFrom(transactions) {
  return transactions.reduce((balances, entry) => {
    balances[entry.token] = (balances[entry.token] ?? 0) + entry.amount;
    return balances;
  }, {});
}

export default function HomePage() {
  const rewards = useOutletContext();
  const { data, ready, levelInfo, showNotice } = rewards;
  const nextReward = levelInfo.next ? rewardForLevel(levelInfo.next.number) : null;
  const balances = balancesFrom(data.transactions);
  const latestActivity = data.activity.slice(0, 3);

  if (!ready) return <div className={styles.loadingCard} aria-label="Loading dashboard" />;

  return (
    <div className={ui.page}>
      <div className={styles.welcomeRow}>
        <div>
          <span className={ui.eyebrow}>YOUR REWARDS JOURNEY</span>
          <h1>Good to see you, {data.profile.displayName.split(" ")[0]}.</h1>
          <p>Small steps add up. Here’s where your progress stands today.</p>
        </div>
        <span className={styles.welcomeIcon}><Sparkles size={19} /></span>
      </div>

      <section className={styles.heroGrid}>
        <article className={`${ui.card} ${styles.levelHero}`}>
          <div className={styles.heroTop}>
            <div className={styles.levelBadge}>
              <Award size={25} strokeWidth={1.5} />
              <span>LVL</span>
            </div>
            <div className={styles.heroLevel}>
              <span className={ui.eyebrow}>CURRENT LEVEL · DEMO</span>
              <h2>Level {String(levelInfo.current.number).padStart(2, "0")}</h2>
              <p>{levelInfo.current.title} badge · {levelInfo.current.badge}</p>
            </div>
            <div className={styles.xpTotal}>
              <strong>{formatNumber(data.xp)}</strong>
              <span>total XP</span>
            </div>
          </div>
          <div className={styles.heroProgress}>
            <XPBar xp={data.xp} nextLevel={levelInfo.next} progress={levelInfo.progress} />
          </div>
          <div className={styles.levelFooter}>
            <span><ArrowUpRight size={14} /> {levelInfo.next ? `${formatNumber(levelInfo.xpNeeded)} XP to level ${levelInfo.next.number}` : "Top level reached"}</span>
            <Link to="/levels" className={ui.textLink}>Explore roadmap <ArrowRight size={14} /></Link>
          </div>
        </article>

        <article className={`${ui.card} ${styles.nextReward}`}>
          <div className={styles.rewardTopline}>
            <span className={ui.eyebrow}>NEXT LEVEL REWARD</span>
            <span className={styles.lockIcon}><Gem size={17} /></span>
          </div>
          {nextReward ? (
            <>
              <span className={styles.levelPill}>LEVEL {String(nextReward.level).padStart(2, "0")} · LOCKED</span>
              <h2>{formatReward(nextReward)}</h2>
              <p>{nextReward.name} · Reach level {nextReward.level} to unlock this demo reward.</p>
              <div className={styles.rewardProgress}>
                <XPBar compact xp={data.xp} nextLevel={levelInfo.next} progress={levelInfo.progress} />
              </div>
              <Link to="/rewards" className={ui.textLink}>View rewards <ArrowRight size={14} /></Link>
            </>
          ) : (
            <>
              <h2>Every milestone earned</h2>
              <p>You’ve reached the top level in this demo roadmap.</p>
              <Link to="/rewards" className={ui.textLink}>Browse your rewards <ArrowRight size={14} /></Link>
            </>
          )}
        </article>
      </section>

      <section className={styles.statsGrid} aria-label="Demo wallet summary">
        <div className={`${ui.card} ${styles.statCard}`}>
          <span className={styles.statIcon}><Coins size={17} /></span>
          <span className={styles.statLabel}>VE coins · demo</span>
          <strong>{formatNumber(balances.VE ?? 0)}</strong>
          <span className={styles.statCaption}>Illustrative balance</span>
        </div>
        <div className={`${ui.card} ${styles.statCard}`}>
          <span className={`${styles.statIcon} ${styles.purpleIcon}`}><Gem size={17} /></span>
          <span className={styles.statLabel}>Gems · demo</span>
          <strong>{formatNumber(balances.Gems ?? 0)}</strong>
          <span className={styles.statCaption}>Illustrative balance</span>
        </div>
        <div className={`${ui.card} ${styles.statCard}`}>
          <span className={`${styles.statIcon} ${styles.greenIcon}`}><WalletCards size={17} /></span>
          <span className={styles.statLabel}>SVEs · demo</span>
          <strong>{formatNumber(balances.SVEs ?? 0)}</strong>
          <span className={styles.statCaption}>Illustrative balance</span>
        </div>
      </section>

      <section className={styles.lowerGrid}>
        <div className={`${ui.card} ${ui.cardPad} ${styles.activityCard}`}>
          <div className={ui.sectionTitle}>
            <span>Recent XP activity</span>
            <Link to="/wallet" className={ui.textLink}>Full history <ChevronRight size={14} /></Link>
          </div>
          {latestActivity.length ? (
            <div className={styles.activityList}>
              {latestActivity.map((item) => (
                <div className={styles.activityItem} key={item.id}>
                  <span className={styles.activityIcon}><Zap size={15} /></span>
                  <span className={styles.activityText}>
                    <strong>{item.label}</strong><small>{item.detail} · {item.at}</small>
                  </span>
                  <span className={styles.xpEarned}><ArrowUpRight size={13} />+{item.xp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={ui.emptyState}>
              <Zap size={20} /><h3>Your XP journey starts here</h3>
              <p>Complete a demo activity to see progress here.</p>
              <Link to="/earn" className={ui.textLink}>Start earning XP <ArrowRight size={13} /></Link>
            </div>
          )}
        </div>

        <div className={`${ui.card} ${ui.cardPad} ${styles.actionsCard}`}>
          <div className={ui.sectionTitle}><span>Pick up where you left off</span></div>
          <div className={styles.quickLinks}>
            <Link to="/earn" className={styles.quickLink}>
              <span className={styles.quickIcon}><Zap size={17} /></span>
              <span><strong>Earn XP</strong><small>Explore daily activities</small></span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/wallet" className={styles.quickLink}>
              <span className={`${styles.quickIcon} ${styles.purpleIcon}`}><WalletCards size={17} /></span>
              <span><strong>Wallet</strong><small>View demo balances</small></span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/rewards" className={styles.quickLink}>
              <span className={`${styles.quickIcon} ${styles.greenIcon}`}><Award size={17} /></span>
              <span><strong>Rewards</strong><small>See earned milestones</small></span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.playBanner}>
            <div><Gamepad2 size={18} /><span><strong>Need a quick XP boost?</strong><small>Try the memory match game.</small></span></div>
            <Link to="/game" aria-label="Play Reward Match"><ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <div className={styles.demoNote}>
        <span><Flame size={14} /> Demo values</span>
        <p>Levels, balances and XP shown here are illustrative for this local prototype, not official VELOOP reward rules.</p>
        <button onClick={() => showNotice("All balances and rewards on this site are local demo values.")} aria-label="More about demo values">
          <Compass size={15} />
        </button>
      </div>
    </div>
  );
}
