function formatTimeHHMMSS(totalSec) {
  if (!totalSec || totalSec <= 0 || isNaN(totalSec)) return "00:00:00";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function FocusTimer({
  activeHabit,
  onPause,
  onResume,
  onReset,
  onMarkComplete,
  onOpenAddMoreTime,
}) {
  const hasActiveTimer = activeHabit && activeHabit.timer && activeHabit.timer.plannedSeconds > 0;

  const id = hasActiveTimer ? activeHabit.id : null;
  const title = hasActiveTimer ? activeHabit.title : "No active timer selected";
  const timer = hasActiveTimer ? activeHabit.timer : { plannedSeconds: 0, remainingSeconds: 0, status: "idle" };

  const { plannedSeconds, remainingSeconds, status } = timer;

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isFinished = hasActiveTimer && remainingSeconds === 0 && plannedSeconds > 0;

  const progressPercent = plannedSeconds > 0 ? remainingSeconds / plannedSeconds : 0;
  const strokeDasharray = 816.81;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent);

  return (
    <section className="focus-timer-section" aria-label="Focus Timer Instrument">
      <div className="timer-header-title">
        <h2>Focus Instrument</h2>
        <p className="active-habit-subtitle">
          {hasActiveTimer ? (
            <>Active Habit: <strong>{title}</strong></>
          ) : (
            "Select a habit or start a focus session"
          )}
        </p>
      </div>

      <div className={`large-circular-timer ${isFinished ? "complete" : ""} ${isRunning ? "running" : ""}`}>
        <svg className="timer-circle-svg" viewBox="0 0 300 300" aria-hidden="true">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B85C46" />
              <stop offset="100%" stopColor="#668A72" />
            </linearGradient>
          </defs>
          <circle className="circle-bg" cx="150" cy="150" r="130" />
          <circle
            className="circle-progress"
            cx="150"
            cy="150"
            r="130"
            stroke="url(#timerGradient)"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="timer-inner-content">
          <span className="timer-badge">FOCUS</span>

          <div className="timer-hhmmss-display" aria-live="polite">
            {formatTimeHHMMSS(remainingSeconds)}
          </div>

          {isFinished ? (
            <div className="timer-complete-text">
              Planned focus time complete!
            </div>
          ) : (
            <span className="timer-inner-sublabel">
              {hasActiveTimer ? (isRunning ? "Counting down..." : "Focus session paused") : "00:00:00"}
            </span>
          )}
        </div>
      </div>

      <div className="timer-external-controls">
        {hasActiveTimer ? (
          <>
            {isRunning && (
              <button
                className="btn-timer-primary btn-pause"
                onClick={() => onPause(id)}
                aria-label="Pause timer"
              >
                Pause
              </button>
            )}

            {(isPaused || (!isRunning && !isFinished)) && (
              <button
                className="btn-timer-primary btn-start"
                onClick={() => onResume(id)}
                aria-label="Resume timer"
              >
                Resume Focus
              </button>
            )}

            {!isFinished && (
              <button
                className="btn-timer-secondary btn-reset"
                onClick={() => onReset(id)}
                aria-label="Reset timer"
              >
                Reset
              </button>
            )}

            {isFinished && (
              <div className="timer-finished-actions">
                <button
                  className="btn-timer-primary btn-start"
                  onClick={() => onMarkComplete(id)}
                >
                  Mark Habit Complete
                </button>
                <button
                  className="btn-timer-secondary"
                  onClick={() => onOpenAddMoreTime(id)}
                >
                  + Add More Time
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="timer-idle-hint">
            Start a focus session on any habit card above or create a timed habit.
          </div>
        )}
      </div>
    </section>
  );
}

export default FocusTimer;
