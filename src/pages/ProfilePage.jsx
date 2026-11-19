import { useState } from "react";
import { Award, Check, CircleHelp, RotateCcw, Save, UserRound } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { formatNumber } from "../data/levels.js";
import styles from "./profile.module.css";
import ui from "../styles/ui.module.css";

export default function ProfilePage() {
  const rewards = useOutletContext();
  const { data, updateProfile, resetDemo, levelInfo, showNotice } = rewards;
  const [displayName, setDisplayName] = useState(data.profile.displayName);
  const [bio, setBio] = useState(data.profile.bio);
  const [formError, setFormError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = displayName.trim();
    const cleanBio = bio.trim();
    if (cleanName.length < 2 || cleanName.length > 24) {
      setFormError("Display name must be between 2 and 24 characters.");
      return;
    }
    if (cleanBio.length > 120) {
      setFormError("About me must be 120 characters or fewer.");
      return;
    }
    setFormError("");
    updateProfile({ displayName: cleanName, bio: cleanBio });
  }

  function resetProgress() {
    const confirmed = window.confirm("Reset local demo XP, wallet activity, profile, and claims?");
    if (!confirmed) return;
    resetDemo();
    setDisplayName("Alex Morgan");
    setBio("Curious explorer, one level at a time.");
    setFormError("");
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeading}>
        <div>
          <span className={ui.eyebrow}>YOUR SPACE · LOCAL DEMO</span>
          <h1>Profile</h1>
          <p>Manage your display details and see a snapshot of your demo progress.</p>
        </div>
      </div>

      <section className={`${ui.card} ${styles.profileHero}`}>
        <div className={styles.profileAvatar}>{data.profile.displayName.slice(0, 1).toUpperCase()}</div>
        <div className={styles.profileSummary}>
          <span className={ui.eyebrow}>REWARDS MEMBER · DEMO</span>
          <h2>{data.profile.displayName}</h2>
          <p>{data.profile.bio || "Add a short introduction to your profile."}</p>
        </div>
        <div className={styles.profileLevel}>
          <Award size={17} />
          <span>Level {levelInfo.current.number}</span>
          <strong>{formatNumber(data.xp)} XP</strong>
        </div>
      </section>

      <div className={styles.profileGrid}>
        <section className={`${ui.card} ${ui.cardPad}`}>
          <div className={ui.sectionTitle}><span>Edit basic information</span></div>
          <form className={styles.profileForm} onSubmit={handleSubmit} noValidate>
            <div className={ui.formField}>
              <label htmlFor="displayName">Display name</label>
              <input
                className={ui.input}
                id="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={24}
                minLength={2}
                required
                autoComplete="nickname"
                aria-describedby="displayNameHelp"
              />
              <span id="displayNameHelp" className={styles.fieldHint}>2–24 characters. This is a display name only.</span>
            </div>
            <div className={ui.formField}>
              <label htmlFor="bio">About me</label>
              <textarea
                className={ui.textarea}
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={120}
                aria-describedby="bioHelp"
              />
              <span id="bioHelp" className={styles.fieldHint}>{bio.length} / 120 characters</span>
            </div>
            {formError && <p className={styles.formError} role="alert">{formError}</p>}
            <button className={ui.primaryButton} type="submit"><Save size={14} /> Save changes</button>
          </form>
        </section>

        <aside className={`${ui.card} ${ui.cardPad} ${styles.profileAside}`}>
          <div className={ui.sectionTitle}><span>Demo account details</span></div>
          <div className={styles.detailRow}><UserRound size={15} /><span><strong>Local profile</strong><small>No sign-in or account connection</small></span></div>
          <div className={styles.detailRow}><Award size={15} /><span><strong>{levelInfo.current.badge} badge</strong><small>Current demo level badge</small></span></div>
          <div className={styles.detailRow}><CircleHelp size={15} /><span><strong>Saved on this device</strong><small>Progress uses browser local storage</small></span></div>
          <div className={styles.resetBox}>
            <p>Reset returns the local demo to its original XP, wallet and profile values.</p>
            <button className={ui.quietButton} onClick={resetProgress}><RotateCcw size={13} /> Reset demo data</button>
          </div>
        </aside>
      </div>
      <div className={styles.noAuthNote}><Check size={14} /> No login, register, email, password, or logout is required for this local demo.</div>
    </div>
  );
}
