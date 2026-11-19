import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Award,
  CircleHelp,
  Clock3,
  Coins,
  Gem,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./gameArena.module.css";
import ui from "../styles/ui.module.css";

const ROUND_SECONDS = 60;
const PAIR_COUNT = 6;

const SYMBOLS = [
  { id: "coin", label: "coin", Icon: Coins },
  { id: "gem", label: "gem", Icon: Gem },
  { id: "star", label: "star", Icon: Star },
  { id: "shield", label: "shield", Icon: Shield },
  { id: "award", label: "badge", Icon: Award },
  { id: "sparkle", label: "sparkle", Icon: Sparkles },
];

function createDeck() {
  const cards = SYMBOLS.flatMap((symbol) =>
    [0, 1].map((copy) => ({
      id: `${symbol.id}-${copy}`,
      pairId: symbol.id,
      label: symbol.label,
      Icon: symbol.Icon,
      matched: false,
    })),
  );

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return cards;
}

export default function GameArena({ onComplete }) {
  const [phase, setPhase] = useState("start");
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [deck, setDeck] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const firstCardRef = useRef(null);
  const resolvingRef = useRef(false);
  const completionRef = useRef(false);
  const flipTimerRef = useRef(null);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timerId = window.setInterval(() => {
      setSeconds((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timerId);
          setPhase("complete");
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete" || completionRef.current) return;
    completionRef.current = true;
    onComplete(matchedPairs);
  }, [phase, matchedPairs, onComplete]);

  useEffect(
    () => () => window.clearTimeout(flipTimerRef.current),
    [],
  );

  function startGame() {
    window.clearTimeout(flipTimerRef.current);
    completionRef.current = false;
    resolvingRef.current = false;
    firstCardRef.current = null;
    setDeck(createDeck());
    setRevealed([]);
    setMatchedPairs(0);
    setMoves(0);
    setSeconds(ROUND_SECONDS);
    setPhase("playing");
  }

  function resetGame() {
    window.clearTimeout(flipTimerRef.current);
    completionRef.current = false;
    resolvingRef.current = false;
    firstCardRef.current = null;
    setDeck([]);
    setRevealed([]);
    setMatchedPairs(0);
    setMoves(0);
    setSeconds(ROUND_SECONDS);
    setPhase("start");
  }

  function flipCard(card) {
    if (
      phase !== "playing" ||
      resolvingRef.current ||
      card.matched ||
      revealed.includes(card.id)
    ) {
      return;
    }

    if (!firstCardRef.current) {
      firstCardRef.current = card.id;
      setRevealed([card.id]);
      return;
    }

    const firstCardId = firstCardRef.current;
    const firstCard = deck.find((item) => item.id === firstCardId);
    firstCardRef.current = null;
    setRevealed([firstCardId, card.id]);
    setMoves((current) => current + 1);

    if (firstCard?.pairId === card.pairId) {
      setDeck((current) =>
        current.map((item) =>
          item.id === firstCardId || item.id === card.id
            ? { ...item, matched: true }
            : item,
        ),
      );
      setRevealed([]);
      const nextCount = matchedPairs + 1;
      setMatchedPairs(nextCount);
      if (nextCount === PAIR_COUNT) setPhase("complete");
      return;
    }

    resolvingRef.current = true;
    flipTimerRef.current = window.setTimeout(() => {
      setRevealed([]);
      resolvingRef.current = false;
    }, 700);
  }

  const won = matchedPairs === PAIR_COUNT;
  const rewardLabel = won
    ? "+25 XP · +5 VE"
    : matchedPairs > 0
      ? "+5 XP participation"
      : "No reward this round";

  return (
    <section className={`${ui.card} ${styles.gameCard}`}>
      <div className={styles.gameHeader}>
        <div>
          <span className={ui.eyebrow}>PLAY & EARN · LOCAL DEMO</span>
          <h2>Reward Match</h2>
        </div>
        <span className={styles.gameMark}><Sparkles size={18} /></span>
      </div>

      {phase === "start" && (
        <div className={styles.startState}>
          <div className={styles.previewGrid} aria-hidden="true">
            {[Coins, Gem, Star, Shield, Award, Sparkles].map((Icon, index) => (
              <span className={styles.previewCard} key={index}><Icon size={20} /></span>
            ))}
          </div>
          <h3>Find every matching pair</h3>
          <p>Turn over two cards at a time and remember where each reward symbol is hiding.</p>
          <div className={styles.ruleList}>
            <span><Clock3 size={14} /> 60 seconds · 6 matching pairs</span>
            <span><CircleHelp size={14} /> Every two cards count as one move</span>
            <span><Sparkles size={14} /> Match all pairs: +25 XP and +5 VE demo reward</span>
          </div>
          <button className={ui.primaryButton} onClick={startGame}>Start playing</button>
        </div>
      )}

      {phase === "playing" && (
        <div className={styles.playState}>
          <div className={styles.scoreBar}>
            <span>Pairs <strong>{matchedPairs}<small> / {PAIR_COUNT}</small></strong></span>
            <span className={styles.scoreActions}>
              <span className={styles.moves}>Moves <strong>{moves}</strong></span>
              <span className={styles.timer}><Clock3 size={15} /> 00:{String(seconds).padStart(2, "0")}</span>
              <button className={styles.resetButton} onClick={resetGame}><RotateCcw size={12} /> Reset</button>
            </span>
          </div>
          <div className={styles.board} aria-label="Reward Match card board">
            {deck.map((card, index) => {
              const isVisible = card.matched || revealed.includes(card.id);
              const Icon = card.Icon;
              return (
                <button
                  aria-label={
                    card.matched
                      ? `${card.label} pair matched`
                      : isVisible
                        ? `${card.label} card`
                        : `Card ${index + 1}, face down`
                  }
                  aria-pressed={isVisible}
                  className={`${styles.cardButton}${isVisible ? ` ${styles.flipped}` : ""}${card.matched ? ` ${styles.matched}` : ""}`}
                  key={card.id}
                  onClick={() => flipCard(card)}
                  disabled={card.matched || (resolvingRef.current && revealed.includes(card.id))}
                >
                  {isVisible ? <Icon size={22} aria-hidden="true" /> : <span aria-hidden="true">V</span>}
                </button>
              );
            })}
          </div>
          <p className={styles.playTip}>Match the same two reward symbols. Unmatched cards turn back over after a short pause.</p>
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.resultState}>
          <div className={`${styles.resultBadge}${won ? ` ${styles.won}` : ""}`}>
            {won ? <Award size={26} /> : <Sparkles size={26} />}
          </div>
          <span className={ui.eyebrow}>{won ? "ALL PAIRS MATCHED" : "ROUND COMPLETE"}</span>
          <h3>{won ? "A perfect match." : "Nice memory work."}</h3>
          <div className={styles.resultStats}>
            <div><span>Pairs matched</span><strong>{matchedPairs} / {PAIR_COUNT}</strong></div>
            <div><span>Moves</span><strong>{moves}</strong></div>
            <div><span>Demo result</span><strong>{rewardLabel}</strong></div>
          </div>
          <p className={styles.playTip}>
            {won
              ? "Your demo reward has been added to your XP and wallet."
              : matchedPairs > 0
                ? "Your participation XP has been added. Match all 6 pairs for the full demo reward."
                : "No pairs matched this round, so no demo reward was added."}
          </p>
          <div className={styles.resultActions}>
            <button className={ui.primaryButton} onClick={startGame}>
              <RotateCcw size={15} /> Play again
            </button>
            <button className={ui.secondaryButton} onClick={resetGame}>Reset</button>
          </div>
          <Link className={styles.backLink} to="/earn"><ArrowLeft size={14} /> Back to earning activities</Link>
        </div>
      )}
    </section>
  );
}
