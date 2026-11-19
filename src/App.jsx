import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import { Toast } from "./components/Toast.jsx";
import EarnPage from "./pages/EarnPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LevelsPage from "./pages/LevelsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RewardsPage from "./pages/RewardsPage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import { useRewards } from "./hooks/useRewards.js";

export default function App() {
  const rewards = useRewards();

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell rewards={rewards} />}>
          <Route index element={<HomePage />} />
          <Route path="earn" element={<EarnPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="levels" element={<LevelsPage />} />
          <Route path="game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toast notice={rewards.notice} onDismiss={rewards.dismissNotice} />
    </HashRouter>
  );
}
