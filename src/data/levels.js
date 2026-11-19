export const LEVELS = [
  { number: 1, title: "First Steps", minXP: 0, badge: "Seed" },
  { number: 2, title: "Curious", minXP: 600, badge: "Spark" },
  { number: 3, title: "Explorer", minXP: 1_600, badge: "Orbit" },
  { number: 4, title: "Achiever", minXP: 3_200, badge: "Compass" },
  { number: 5, title: "Pioneer", minXP: 5_000, badge: "Pioneer" },
  { number: 6, title: "Trailblazer", minXP: 8_000, badge: "Laurel" },
  { number: 7, title: "Luminary", minXP: 11_000, badge: "Luminary" },
  { number: 8, title: "Vanguard", minXP: 14_500, badge: "Vanguard" },
  { number: 9, title: "Summit", minXP: 18_500, badge: "Summit" },
  { number: 10, title: "Legacy", minXP: 23_000, badge: "Legacy" },
];

export function getLevelInfo(xp) {
  const currentIndex = LEVELS.reduce(
    (lastIndex, level, index) => (xp >= level.minXP ? index : lastIndex),
    0,
  );
  const current = LEVELS[currentIndex];
  const next = LEVELS[currentIndex + 1] ?? null;
  const progress = next
    ? Math.min(100, Math.round((xp / next.minXP) * 100))
    : 100;

  return {
    current,
    next,
    progress,
    xpNeeded: next ? Math.max(0, next.minXP - xp) : 0,
  };
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
