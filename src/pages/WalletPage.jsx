import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Coins, Gem, WalletCards } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { formatNumber } from "../data/levels.js";
import styles from "./wallet.module.css";
import ui from "../styles/ui.module.css";

const TOKEN_META = {
  VE: { label: "VE coins", Icon: Coins, tone: "gold" },
  SVEs: { label: "SVEs", Icon: WalletCards, tone: "blue" },
  Gems: { label: "Gems", Icon: Gem, tone: "purple" },
};

export default function WalletPage() {
  const { data, clearWallet } = useOutletContext();
  const [confirmClear, setConfirmClear] = useState(false);
  const tokens = Object.keys(TOKEN_META);
  const balances = data.transactions.reduce((result, transaction) => {
    result[transaction.token] = (result[transaction.token] ?? 0) + transaction.amount;
    return result;
  }, {});
  const tokenTransactions = data.transactions.filter((transaction) => transaction.token !== "XP");
  const earned = tokens
    .map((token) => `${formatNumber(tokenTransactions
      .filter((item) => item.token === token)
      .reduce((sum, item) => sum + Math.max(item.amount, 0), 0))} ${token}`)
    .join(" · ");
  const spent = tokens
    .map((token) => `${formatNumber(tokenTransactions
      .filter((item) => item.token === token)
      .reduce((sum, item) => sum + Math.abs(Math.min(item.amount, 0)), 0))} ${token}`)
    .join(" · ");

  return (
    <div className={ui.page}>
      <div className={ui.pageHeading}>
        <div>
          <span className={ui.eyebrow}>YOUR DEMO BALANCES</span>
          <h1>Wallet</h1>
          <p>See your illustrative balances and the activity behind them.</p>
        </div>
        <span className={ui.statusTag}>LOCAL DEMO · NO REAL CURRENCY</span>
      </div>

      <section className={styles.balanceGrid} aria-label="Demo balances">
        {tokens.map((token) => {
          const { label, Icon, tone } = TOKEN_META[token];
          return (
            <article className={`${ui.card} ${styles.balanceCard}`} key={token}>
              <div className={`${styles.balanceIcon} ${styles[tone]}`}><Icon size={19} /></div>
              <span className={styles.balanceLabel}>{label}</span>
              <strong>{formatNumber(balances[token] ?? 0)}</strong>
              <span className={styles.balanceNote}>Demo balance · not redeemable</span>
            </article>
          );
        })}
      </section>

      <section className={styles.summaryGrid}>
        <article className={`${ui.card} ${styles.summaryCard}`}>
          <span className={styles.summaryIcon}><ArrowDownRight size={17} /></span>
          <span>Total earned · demo</span>
          <strong>{formatNumber(earned)}</strong>
          <small>Across VE, SVE and gem transactions</small>
        </article>
        <article className={`${ui.card} ${styles.summaryCard}`}>
          <span className={`${styles.summaryIcon} ${styles.spentIcon}`}><ArrowUpRight size={17} /></span>
          <span>Total spent · demo</span>
          <strong>{formatNumber(spent)}</strong>
          <small>No demo spending transactions yet</small>
        </article>
      </section>

      <section className={`${ui.card} ${ui.cardPad}`}>
        <div className={ui.sectionTitle}>
          <span>Transaction history</span>
          <div className={styles.historyActions}>
            <span className={ui.statusTag}>DEMO LEDGER</span>
            <button className={ui.quietButton} onClick={() => setConfirmClear(true)}>Clear demo wallet</button>
          </div>
        </div>
        {tokenTransactions.length ? (
          <div className={styles.transactionList}>
            {tokenTransactions.map((transaction) => {
              const info = TOKEN_META[transaction.token] ?? TOKEN_META.VE;
              const Icon = info.Icon;
              const isEarned = transaction.amount >= 0;
              return (
                <div className={styles.transaction} key={transaction.id}>
                  <span className={`${styles.transactionIcon} ${styles[info.tone]}`}><Icon size={16} /></span>
                  <span className={styles.transactionText}>
                    <strong>{transaction.label}</strong>
                    <small>{transaction.at} · {transaction.token}</small>
                  </span>
                  <span className={`${styles.amount}${isEarned ? ` ${styles.positive}` : ` ${styles.negative}`}`}>
                    {isEarned ? "+" : "−"}{formatNumber(Math.abs(transaction.amount))} {transaction.token}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={ui.emptyState}>
            <WalletCards size={22} />
            <h3>No transactions yet</h3>
            <p>Earn or claim demo rewards to see wallet activity here.</p>
          </div>
        )}
      </section>
      <p className={styles.walletDisclaimer}>All balances and ledger entries are local, illustrative data. They have no cash value and cannot be transferred or redeemed.</p>
      {confirmClear && (
        <Modal title="Clear demo wallet?" onClose={() => setConfirmClear(false)}>
          <div className={styles.clearDialog}>
            <p>This clears the demo wallet history and sets token balances to zero. Your XP, profile, and activity history will stay unchanged.</p>
            <div>
              <button className={ui.quietButton} onClick={() => setConfirmClear(false)}>Cancel</button>
              <button className={ui.primaryButton} onClick={() => { clearWallet(); setConfirmClear(false); }}>Clear wallet</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
