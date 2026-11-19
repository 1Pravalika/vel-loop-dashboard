import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Gamepad2,
  Play,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { EARNING_OPTIONS } from "../data/earning.js";
import { formatNumber } from "../data/levels.js";
import styles from "./earn.module.css";
import ui from "../styles/ui.module.css";

const iconMap = {
  watch: Play,
  "daily-task": Check,
  refer: UsersRound,
  game: Gamepad2,
  challenge: Target,
  bonus: Sparkles,
  streak: Flame,
};

function isDoneToday(claims, id) {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return claims[id] === key;
}

export default function EarnPage() {
  const rewards = useOutletContext();
  const { data, claimEarning, showNotice } = rewards;
  const totalActions = EARNING_OPTIONS.filter((option) => option.status === "available").length;
  const completedActions = EARNING_OPTIONS.filter(
    (option) => option.status === "available" && isDoneToday(data.claims, option.id),
  ).length;

  function activate(option) {
    if (option.status === "coming") {
      showNotice(`${option.title}: Coming Soon. ${option.detail}`);
      return;
    }
    if (option.status === "link") return;
    claimEarning(option);
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeading}>
        <div>
          <span className={ui.eyebrow}>WAYS TO PROGRESS</span>
          <h1>Earn XP & discover rewards</h1>
          <p>Choose an activity that fits your day. Available actions use local demo values only.</p>
        </div>
        <Link to="/levels" className={ui.secondaryButton}><Zap size={15} /> {formatNumber(rewards.levelInfo.xpNeeded)} XP to next level</Link>
      </div>

      <section className={`${ui.card} ${styles.todayCard}`}>
        <div className={styles.todayIcon}><Sparkles size={18} /></div>
        <div className={styles.todayCopy}>
          <span className={ui.eyebrow}>TODAY’S MOMENTUM</span>
          <strong>{completedActions} of {totalActions} demo activities complete</strong>
          <span>Eligible daily demo activities can be completed once per local day.</span>
        </div>
        <div className={styles.todayProgress} role="progressbar" aria-valuenow={completedActions} aria-valuemin={0} aria-valuemax={totalActions} aria-label="Daily demo activities completed">
          <span style={{ width: `${(completedActions / totalActions) * 100}%` }} />
        </div>
      </section>

      <div className={styles.earnGrid}>
        {EARNING_OPTIONS.map((option) => {
          const Icon = iconMap[option.id] ?? Zap;
          const done = option.status === "available" && isDoneToday(data.claims, option.id);
          const content = (
            <>
              <span className={`${styles.activityIcon} ${option.status === "coming" ? styles.comingIcon : ""}`}><Icon size={19} /></span>
              <span className={styles.activityMain}>
                <span className={styles.activityTop}>
                  <strong>{option.title}</strong>
                  {option.status === "coming" ? (
                    <span className={ui.statusTag}>COMING SOON</span>
                  ) : option.status === "link" ? (
                    <span className={`${ui.statusTag} ${ui.statusTagGreen}`}>PLAYABLE</span>
                  ) : done ? (
                    <span className={`${ui.statusTag} ${ui.statusTagGreen}`}><Check size={11} /> DONE TODAY</span>
                  ) : (
                    <span className={ui.statusTag}>DEMO</span>
                  )}
                </span>
                <span className={styles.description}>{option.description}</span>
                <span className={styles.rewardLine}>
                  {option.status === "available"
                    ? `+${option.xp} demo XP${option.coins ? ` · +${option.coins} demo VE` : ""}`
                    : option.status === "link"
                      ? "Skill challenge · demo reward"
                      : "Concept · availability not connected"}
                </span>
              </span>
              <span className={styles.activityAction}>
                {option.status === "link" ? (
                  <Link to="/game" className={ui.secondaryButton}>Play now <ArrowRight size={14} /></Link>
                ) : (
                  <button
                    className={done ? ui.quietButton : option.status === "coming" ? ui.quietButton : ui.primaryButton}
                    onClick={() => activate(option)}
                    disabled={done}
                  >
                    {done ? "Completed" : option.status === "coming" ? "Learn more" : option.actionLabel}
                  </button>
                )}
              </span>
            </>
          );
          return (
            <article className={`${ui.card} ${styles.activityCard}`} key={option.id}>
              {content}
            </article>
          );
        })}
      </div>

      <div className={styles.earnNote}>
        <Clock3 size={15} />
        <p>Demo activity values do not represent official VELOOP offers. Watch, referrals and bonus missions are marked Coming Soon because those services are not connected.</p>
      </div>
    </div>
  );
}
