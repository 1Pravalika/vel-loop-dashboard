import {
  Award,
  CircleHelp,
  Coins,
  Compass,
  Gamepad2,
  Gem,
  House,
  Layers3,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./appShell.module.css";
import ui from "../styles/ui.module.css";
import { LevelUpModal } from "./LevelUpModal.jsx";

const primaryNavigation = [
  { label: "Home", to: "/", icon: House, end: true },
  { label: "Earn", to: "/earn", icon: Zap },
  { label: "Wallet", to: "/wallet", icon: WalletCards },
  { label: "Rewards", to: "/rewards", icon: Award },
  { label: "Profile", to: "/profile", icon: UserRound },
];

const secondaryNavigation = [
  { label: "Level roadmap", to: "/levels", icon: Compass },
  { label: "Reward Match", to: "/game", icon: Gamepad2 },
];

const pageTitles = {
  "/": "Overview",
  "/earn": "Earn",
  "/wallet": "Wallet",
  "/rewards": "Rewards",
  "/profile": "Profile",
  "/levels": "Level-up center",
  "/game": "Reward Match",
};

function LinkList({ links, className = "" }) {
  return (
    <div className={`${styles.linkList} ${className}`}>
      {links.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
          }
          end={end}
          key={to}
          to={to}
          aria-label={label}
        >
          <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default function AppShell({ rewards }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Overview";
  const { data, ready, storageError } = rewards;

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <NavLink className={styles.brand} to="/" aria-label="VELOOP Rewards home">
          <span className={styles.brandMark}><span>V</span></span>
          <span className={styles.brandText}>VELOOP<span>REWARDS</span></span>
        </NavLink>
        <p className={styles.navCaption}>YOUR SPACE</p>
        <LinkList links={primaryNavigation} />
        <p className={`${styles.navCaption} ${styles.navCaptionSecond}`}>DISCOVER</p>
        <LinkList links={secondaryNavigation} />
        <div className={styles.sidebarBottom}>
          <div className={styles.demoBadge}><span /> Local demo mode</div>
          <p>Rewards and balances shown here are illustrative only.</p>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.mobileBrand}>
            <span className={styles.brandMark}><span>V</span></span>
            <span>VELOOP</span>
          </div>
          <div className={styles.breadcrumb}>
            <span>VELOOP</span><span className={styles.breadcrumbSlash}>/</span>
            <strong>{title}</strong>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.demoChip}><span /> Demo values</span>
            <NavLink className={styles.avatar} to="/profile" aria-label="Open profile">
              {data.profile.displayName.slice(0, 1).toUpperCase()}
            </NavLink>
          </div>
        </header>

        {storageError && (
          <div className={styles.storageAlert} role="status">
            <CircleHelp size={17} /> Local storage is unavailable. Progress may not persist after refresh.
          </div>
        )}
        {!ready && <div className={styles.loadingLine} aria-label="Loading demo data" />}

        <main className={styles.content}>
          <Outlet context={rewards} />
        </main>
      </div>

      <nav className={styles.mobileNav} aria-label="Main navigation">
        {primaryNavigation.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            className={({ isActive }) =>
              `${styles.mobileNavLink}${isActive ? ` ${styles.mobileActive}` : ""}`
            }
            end={end}
            key={to}
            to={to}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className={styles.mobileExtraLinks}>
          <NavLink to="/levels" aria-label="Level roadmap"><Layers3 size={18} /></NavLink>
          <NavLink to="/game" aria-label="Reward Match game"><Gamepad2 size={18} /></NavLink>
        </div>
      </nav>
      <LevelUpModal level={rewards.levelUp} onClose={rewards.closeLevelUp} />
    </div>
  );
}
