export const REWARDS = [
  {
    id: "spark-badge",
    level: 2,
    name: "Spark Badge",
    description: "A first milestone marker for your rewards profile.",
    kind: "badge",
    icon: "sparkles",
  },
  {
    id: "orbit-gems",
    level: 3,
    name: "Gem Pair",
    description: "A small demo gem reward for reaching a new milestone.",
    kind: "currency",
    token: "Gems",
    amount: 2,
    icon: "gem",
  },
  {
    id: "compass-badge",
    level: 4,
    name: "Compass Badge",
    description: "A profile badge celebrating steady progress.",
    kind: "badge",
    icon: "compass",
  },
  {
    id: "pioneer-badge",
    level: 5,
    name: "Pioneer Badge",
    description: "Your current-level demo badge.",
    kind: "badge",
    icon: "award",
  },
  {
    id: "trailblazer-vault",
    level: 6,
    name: "Trailblazer Vault",
    description: "A demo milestone reward for the next level.",
    kind: "bundle",
    items: [
      { token: "VE", amount: 500 },
      { token: "Gems", amount: 25 },
    ],
    icon: "vault",
  },
  {
    id: "luminary-sves",
    level: 7,
    name: "Luminary Tokens",
    description: "A demo token bundle for a future level.",
    kind: "currency",
    token: "SVEs",
    amount: 12,
    icon: "coins",
  },
  {
    id: "vanguard-badge",
    level: 8,
    name: "Vanguard Badge",
    description: "A future profile badge in this demo roadmap.",
    kind: "badge",
    icon: "shield",
  },
  {
    id: "summit-gems",
    level: 9,
    name: "Summit Gems",
    description: "A future demo reward milestone.",
    kind: "currency",
    token: "Gems",
    amount: 50,
    icon: "gem",
  },
  {
    id: "legacy-vault",
    level: 10,
    name: "Legacy Vault",
    description: "A future demo bundle at the top of this roadmap.",
    kind: "bundle",
    items: [
      { token: "VE", amount: 1_000 },
      { token: "SVEs", amount: 30 },
    ],
    icon: "vault",
  },
];

export function rewardForLevel(level) {
  return REWARDS.find((reward) => reward.level === level) ?? null;
}

export function formatReward(reward) {
  if (!reward) return "A new milestone";
  if (reward.kind === "bundle") {
    return reward.items.map(({ amount, token }) => `${amount} ${token}`).join(" + ");
  }
  if (reward.kind === "currency") return `${reward.amount} ${reward.token}`;
  return reward.name;
}
