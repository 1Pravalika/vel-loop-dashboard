
import React, { useState } from "react";
import styles from "./DashboardStates.module.css";

function DashboardStates() {
    const [currentState, setCurrentState] = useState("loading");

    function handleRetry() {
        setCurrentState("loading");

        // Demo: automatically show the dashboard loaded state
        setTimeout(() => {
            setCurrentState("success");
        }, 1500);
    }

    return (
        <div className={styles.container}>
            <p className={styles.subtitle}>DASHBOARD SYSTEM STATES</p>

            <h2>Loading, Empty & Error States</h2>

            <p className={styles.description}>
                Click each button to preview how the dashboard responds.
            </p>

            <div className={styles.buttons}>
                <button
                    className={currentState === "loading" ? styles.activeButton : ""}
                    onClick={() => setCurrentState("loading")}
                >
                    Loading
                </button>

                <button
                    className={currentState === "empty" ? styles.activeButton : ""}
                    onClick={() => setCurrentState("empty")}
                >
                    Empty
                </button>

                <button
                    className={currentState === "error" ? styles.activeButton : ""}
                    onClick={() => setCurrentState("error")}
                >
                    Error
                </button>
            </div>

            <div className={styles.stateBox} aria-live="polite">

                {currentState === "loading" && (
                    <>
                        <div className={styles.spinner}></div>
                        <h3>Loading your rewards...</h3>
                        <p>Please wait while we prepare your dashboard.</p>
                    </>
                )}

                {currentState === "empty" && (
                    <>
                        <div className={styles.stateIcon}>📭</div>
                        <h3>No XP activity yet</h3>
                        <p>
                            Your recent activities will appear here
                            when available.
                        </p>
                        <button
                            className={styles.retryButton}
                            onClick={handleRetry}
                        >
                            Refresh
                        </button>
                    </>
                )}

                {currentState === "error" && (
                    <>
                        <div className={styles.stateIcon}>⚠️</div>
                        <h3>Something went wrong</h3>
                        <p>
                            We couldn't load your rewards data.
                            Please try again.
                        </p>
                        <button
                            className={styles.retryButton}
                            onClick={handleRetry}
                        >
                            Try Again
                        </button>
                    </>
                )}

                {currentState === "success" && (
                    <>
                        <div className={styles.stateIcon}>✓</div>
                        <h3>Dashboard loaded successfully!</h3>
                        <p>Your demo rewards data is ready.</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => setCurrentState("loading")}
                        >
                            View Loading Again
                        </button>
                    </>
                )}

            </div>

            <p className={styles.note}>
                These are interactive demo previews. Actual API loading
                and error handling will be connected when backend APIs
                are available.
            </p>
        </div>
    );
}

export default DashboardStates;
