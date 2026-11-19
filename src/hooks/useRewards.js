import { useEffect, useMemo, useRef, useState } from "react";
import { getLevelInfo } from "../data/levels.js";
import { REWARDS } from "../data/rewards.js";

const STORAGE_KEY = "velop-rewards-demo-v1";

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function seedData() {
  return {
    xp: 6_420,
    profile: {
      displayName: "Alex Morgan",
      bio: "Curious explorer, one level at a time.",
    },
    claims: {},
    claimedRewards: [],
    transactions: [
      { id: "seed-1", token: "VE", amount: 120, label: "Demo opening balance", at: "Today" },
      { id: "seed-2", token: "SVEs", amount: 12, label: "Demo opening balance", at: "Today" },
      { id: "seed-3", token: "Gems", amount: 8, label: "Demo opening balance", at: "Today" },
    ],
    activity: [
      { id: "activity-1", label: "Daily task", detail: "Demo activity", xp: 50, at: "Today" },
      { id: "activity-2", label: "Game challenge", detail: "Demo activity", xp: 25, at: "Yesterday" },
      { id: "activity-3", label: "Streak visit", detail: "Demo activity", xp: 15, at: "Yesterday" },
    ],
  };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useRewards() {
  const [data, setData] = useState(seedData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const dismissTimer = useRef(null);
  const previousLevel = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Number.isFinite(parsed.xp) &&
          parsed.profile &&
          Array.isArray(parsed.transactions) &&
          Array.isArray(parsed.activity)
        ) {
          setData({
            ...seedData(),
            ...parsed,
            claims: parsed.claims ?? {},
            claimedRewards: parsed.claimedRewards ?? [],
          });
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      setStorageError(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data, ready]);

  const levelInfo = useMemo(() => getLevelInfo(data.xp), [data.xp]);

  useEffect(() => {
    if (!ready) return;
    const currentNumber = levelInfo.current.number;
    if (
      previousLevel.current !== null &&
      currentNumber > previousLevel.current
    ) {
      setLevelUp(levelInfo.current);
      showNotice(`Level ${currentNumber} unlocked. Nice progress!`);
    }
    previousLevel.current = currentNumber;
  }, [levelInfo, ready]);

  function showNotice(message) {
    window.clearTimeout(dismissTimer.current);
    setNotice(message);
    dismissTimer.current = window.setTimeout(() => setNotice(null), 3600);
  }

  useEffect(() => () => window.clearTimeout(dismissTimer.current), []);

  function recordActivity({ label, xp, coins = 0, detail = "Demo activity" }) {
    const stamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    setData((current) => ({
      ...current,
      xp: current.xp + xp,
      activity: [
        { id: makeId(), label, detail, xp, at: `Today, ${stamp}` },
        ...current.activity,
      ].slice(0, 12),
      transactions: [
        ...(coins > 0
          ? [{ id: makeId(), token: "VE", amount: coins, label, at: `Today, ${stamp}` }]
          : []),
        { id: makeId(), token: "XP", amount: xp, label, at: `Today, ${stamp}` },
        ...current.transactions,
      ].slice(0, 40),
    }));
    showNotice(`+${xp} demo XP added${coins ? ` and +${coins} demo VE` : ""}.`);
  }

  function claimEarning(option) {
    const today = todayKey();
    if (data.claims[option.id] === today) {
      showNotice("You have already completed this demo activity today.");
      return;
    }
    setData((current) => ({
      ...current,
      claims: { ...current.claims, [option.id]: today },
    }));
    recordActivity({
      label: option.title,
      xp: option.xp,
      coins: option.coins,
      detail: "Daily demo activity",
    });
  }

  function claimReward(reward) {
    if (levelInfo.current.number < reward.level) {
      showNotice(`Reach level ${reward.level} to unlock this demo reward.`);
      return;
    }
    if (data.claimedRewards.includes(reward.id)) {
      showNotice("This demo reward has already been claimed.");
      return;
    }
    const items =
      reward.kind === "bundle"
        ? reward.items
        : reward.kind === "currency"
          ? [{ token: reward.token, amount: reward.amount }]
          : [];
    setData((current) => ({
      ...current,
      claimedRewards: [...current.claimedRewards, reward.id],
      transactions: [
        ...items.map(({ token, amount }) => ({
          id: makeId(),
          token,
          amount,
          label: reward.name,
          at: "Today",
        })),
        ...current.transactions,
      ].slice(0, 40),
    }));
    showNotice(`${reward.name} added to your demo wallet.`);
  }

  function updateProfile(profile) {
    setData((current) => ({ ...current, profile }));
    showNotice("Your demo profile has been updated.");
  }

  function clearWallet() {
    setData((current) => ({ ...current, transactions: [] }));
    showNotice("Demo wallet history cleared and balances reset to zero.");
  }

  function resetDemo() {
    setData(seedData());
    setLevelUp(null);
    previousLevel.current = levelInfo.current.number;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setStorageError(false);
      showNotice("Demo progress has been reset.");
    } catch {
      setStorageError(true);
    }
  }

  function closeLevelUp() {
    setLevelUp(null);
  }

  return {
    data,
    ready,
    storageError,
    notice,
    levelInfo,
    levelUp,
    showNotice,
    dismissNotice: () => setNotice(null),
    recordActivity,
    claimEarning,
    claimReward,
    updateProfile,
    clearWallet,
    resetDemo,
    closeLevelUp,
    rewards: REWARDS,
  };
}
