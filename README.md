<<<<<<< HEAD
# VELOOP Rewards — Local Demo

A responsive React and Vite rewards dashboard prototype. It includes a home dashboard, earning activities, a demo wallet, milestone rewards, an editable local profile, a level progression roadmap, and the playable Reward Match mini-game.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`).

Create a production build with `npm run build`; preview it locally with `npm run preview`.

## Demo level and XP system

Level thresholds and badge labels are configured separately in `src/data/levels.js`. The starting profile has 6,420 demo XP and begins at Level 5, with 1,580 XP remaining to the configured Level 6 threshold. XP progress is calculated from the configured level thresholds. Crossing a threshold opens a level-up celebration.

These are illustrative development values, not official VELOOP progression rules. Progress, claims, and transactions are kept in this browser's local storage. No service, backend, or real reward processing is connected.

## Demo rewards and earning activities

Milestone rewards are configured separately in `src/data/rewards.js`. Daily demo activities and their illustrative values are in `src/data/earning.js`. Daily Tasks, Daily Challenge, and Streak XP are limited to one completion per local calendar day. Watch & Earn, Refer & Earn, and Bonus Missions are marked Coming Soon because they are not connected.

Reward Match is a memory game with six symbol pairs and a 60-second round. Match all six pairs to earn 25 demo XP and 5 demo VE; matching one to five pairs earns 5 demo XP; matching none earns nothing. Practice rounds can be replayed. These rules and amounts are for this local prototype only.

## Project structure

```text
src/
  assets/       Local illustrations
  components/   App shell, progress, roadmap, dialogs, game, notifications
  data/         Demo levels, rewards, and earning configuration
  hooks/        Local reward and profile state
  pages/        Home, Earn, Wallet, Rewards, Profile, Levels, Game
  styles/       Global styles and shared CSS Module classes
```

The UI uses React Hooks, Vite, Bootstrap, Lucide icons, and CSS Modules. It includes responsive navigation, reduced-motion handling, form validation, empty states, local storage error messaging, and keyboard-dismissible dialogs.

## Local-only scope

There are no Login or Register pages, no authentication, and no deployment or GitHub setup. Wallet balances and all reward values are demo data with no cash value.
=======
# vel-loop-dashboard
>>>>>>> 41879dfb3c319e0245677495879980ecc3d5c6da
