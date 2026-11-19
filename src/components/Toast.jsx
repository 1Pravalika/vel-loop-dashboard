import { CheckCircle2, X } from "lucide-react";
import styles from "./toast.module.css";

export function Toast({ notice, onDismiss }) {
  if (!notice) return null;
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <CheckCircle2 size={17} />
      <span>{notice}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification"><X size={15} /></button>
    </div>
  );
}
