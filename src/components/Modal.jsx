import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./modal.module.css";

export default function Modal({ title, children, onClose, accent = false }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className={`${styles.dialog}${accent ? ` ${styles.accent}` : ""}`}
        role="dialog"
      >
        <div className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
}
