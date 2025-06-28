import { useEffect, useState } from "react";
import styles from "../styles/Timer.module.css";
import { FaStop } from "react-icons/fa";

function Timer({ activeEntry, onStop, ...props }) {
  const [showTimeRunning, setShowTimeRunning] = useState(false);

  useEffect(() => {
    let timeout;
    if (activeEntry) {
      setShowTimeRunning(true);
      timeout = setTimeout(() => setShowTimeRunning(false), 3000);
    } else {
      setShowTimeRunning(false);
    }
    return () => clearTimeout(timeout);
  }, [activeEntry]);

  return (
    <div className={styles.timer}>
      {/* ...existing code... */}
      <div className={styles.controlSection}>
        {activeEntry ? (
          <button
            className={`${styles.timerButton} ${styles.stopButton} ${styles.activeTimer}`}
            onClick={onStop}
            type="button"
          >
            <span className={styles.pulse} />
            <span
              className={`${styles.timeRunning} ${
                showTimeRunning ? styles.fadeIn : styles.fadeOut
              }`}
            >
              Time Running
            </span>
            <FaStop />
          </button>
        ) : (
          // ...your start button here...
        )}
      </div>
      {/* ...existing code... */}
    </div>
  );
}

export default Timer;