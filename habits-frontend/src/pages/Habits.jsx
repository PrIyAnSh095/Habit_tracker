import { useState, useEffect, useRef, useCallback } from "react";
import HabitCard, { ELEMENTS, getHabitElementKey } from "../components/HabitCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import FocusTimer from "../components/FocusTimer";

import waterAsset from "../assets/water.svg";
import fireAsset from "../assets/fire.svg";
import earthAsset from "../assets/earth.svg";
import airAsset from "../assets/air.svg";
import lightAsset from "../assets/light.svg";

const API_URL = "http://localhost:5000";

const QUOTES = [
  "Small steps every day become big changes.",
  "The secret of getting ahead is getting started.",
  "You don't have to be great to start, but you have to start to be great.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "A journey of a thousand miles begins with a single step.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "It's not about being the best. It's about being better than you were yesterday.",
  "Don't watch the clock; do what it does. Keep going.",
  "Good habits formed at youth make all the difference.",
  "We are what we repeatedly do. Excellence is not an act, but a habit.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your future is created by what you do today, not tomorrow.",
  "Progress, not perfection.",
  "Discipline is choosing between what you want now and what you want most.",
  "Every day is a chance to get better.",
  "The best time to start was yesterday. The next best time is now.",
  "Consistency is the key to achieving and maintaining momentum.",
];

const DEFAULT_STARTER_TIMERS = {
  "Drink 2L Water": 15 * 60,
  "Exercise for 30 Minutes": 30 * 60,
  "Read for 20 Minutes": 20 * 60,
  "Practice Coding": 60 * 60,
  "Sleep 8 Hours": 8 * 3600,
};

function getMotivationalMessage(percentage) {
  if (percentage === 0) return { text: "Let's get started!" };
  if (percentage <= 20) return { text: "Nice start!" };
  if (percentage <= 40) return { text: "You're building momentum!" };
  if (percentage <= 60) return { text: "You're on a roll!" };
  if (percentage <= 80) return { text: "Looking strong!" };
  if (percentage <= 99) return { text: "Almost there!" };
  return { text: "Perfect Day!" };
}

function formatTimeHHMMSS(totalSec) {
  if (!totalSec || totalSec <= 0 || isNaN(totalSec)) return "00:00:00";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function createGeometricConfetti(containerRef) {
  if (!containerRef.current) return;

  const elementColors = ["#2B7FFF", "#FF4D4D", "#2E8B57", "#7097AB", "#FFC107", "#B85C46"];
  const container = containerRef.current;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "geo-confetti-particle";

    const color = elementColors[Math.floor(Math.random() * elementColors.length)];
    const width = Math.random() * 8 + 4;
    const height = Math.random() > 0.4 ? Math.random() * 12 + 6 : width;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.4;
    const duration = Math.random() * 1.4 + 1.2;
    const rotation = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 140;
    const borderRadius = Math.random() > 0.5 ? "50%" : "2px";

    particle.style.cssText = `
      position: fixed;
      width: ${width}px;
      height: ${height}px;
      background: ${color};
      left: ${left}%;
      top: -15px;
      border-radius: ${borderRadius};
      z-index: 9999;
      pointer-events: none;
      opacity: 0.9;
      transform: rotate(${rotation}deg);
      animation: geo-confetti-fall ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards;
      --drift: ${drift}px;
    `;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + delay) * 1000 + 200);
  }
}

function Habits() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedElement, setSelectedElement] = useState("water");

  const [timerMode, setTimerMode] = useState("none");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [formValidationError, setFormValidationError] = useState("");

  const [habitElements, setHabitElements] = useState(() => {
    try {
      const saved = localStorage.getItem("habit_element_map");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [habitTimers, setHabitTimers] = useState(() => {
    try {
      const saved = localStorage.getItem("habit_timer_map");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeHabitId, setActiveHabitId] = useState(null);

  const [prematureModalData, setPrematureModalData] = useState(null);
  const [addTimeModalData, setAddTimeModalData] = useState(null);
  const [addTimeH, setAddTimeH] = useState("00");
  const [addTimeM, setAddTimeM] = useState("30");
  const [addTimeS, setAddTimeS] = useState("00");
  const [addTimeError, setAddTimeError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );

  const [confettiShown, setConfettiShown] = useState(false);
  const prevPerfectRef = useRef(false);
  const confettiContainerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("habit_element_map", JSON.stringify(habitElements));
    } catch (e) {}
  }, [habitElements]);

  useEffect(() => {
    try {
      localStorage.setItem("habit_timer_map", JSON.stringify(habitTimers));
    } catch (e) {}
  }, [habitTimers]);

  useEffect(() => {
    if (!activeHabitId) return;

    const interval = setInterval(() => {
      setHabitTimers((prev) => {
        const current = prev[activeHabitId];
        if (!current || current.remainingSeconds <= 0) {
          setActiveHabitId(null);
          return {
            ...prev,
            [activeHabitId]: {
              ...current,
              remainingSeconds: 0,
              status: "completed",
            },
          };
        }

        const nextSec = current.remainingSeconds - 1;
        const isDone = nextSec <= 0;
        if (isDone) setActiveHabitId(null);

        return {
          ...prev,
          [activeHabitId]: {
            ...current,
            remainingSeconds: isDone ? 0 : nextSec,
            status: isDone ? "completed" : "running",
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeHabitId]);

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const pendingHabits = totalHabits - completedHabits;

  const percentage =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const isPerfectDay = totalHabits > 0 && completedHabits === totalHabits;
  const motivation = getMotivationalMessage(percentage);

  useEffect(() => {
    if (isPerfectDay && !prevPerfectRef.current && !confettiShown) {
      setConfettiShown(true);
      createGeometricConfetti(confettiContainerRef);
    }
    if (!isPerfectDay && confettiShown) {
      setConfettiShown(false);
    }
    prevPerfectRef.current = isPerfectDay;
  }, [isPerfectDay, confettiShown]);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/habits`);
      if (!response.ok) throw new Error("Failed to fetch habits");
      const data = await response.json();
      setHabits(data);

      setHabitTimers((prev) => {
        let updated = false;
        const next = { ...prev };
        data.forEach((h) => {
          if (!next[h.id] && DEFAULT_STARTER_TIMERS[h.title]) {
            const starterSec = DEFAULT_STARTER_TIMERS[h.title];
            next[h.id] = {
              plannedSeconds: starterSec,
              remainingSeconds: starterSec,
              status: "idle",
            };
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    } catch (err) {
      setError(err.message || "Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handlePresetClick = (mode, minutes) => {
    setTimerMode(mode);
    if (minutes > 0) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      setTimerHours(h.toString().padStart(2, "0"));
      setTimerMinutes(m.toString().padStart(2, "0"));
      setTimerSeconds("00");
      setFormValidationError("");
    }
  };

  const calculatePlannedSeconds = () => {
    if (timerMode === "none") return 0;

    const h = parseInt(timerHours, 10);
    const m = parseInt(timerMinutes, 10);
    const s = parseInt(timerSeconds, 10);

    if (isNaN(h) || h < 0 || isNaN(m) || m < 0 || m > 59 || isNaN(s) || s < 0 || s > 59) {
      setFormValidationError("Normalized to 00:00:00 (no timer).");
      return 0;
    }

    setFormValidationError("");
    return h * 3600 + m * 60 + s;
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const plannedSeconds = calculatePlannedSeconds();

    try {
      const response = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add habit");
      }

      const newHabit = await response.json();

      setHabitElements((prev) => ({
        ...prev,
        [newHabit.id]: selectedElement,
      }));

      if (plannedSeconds > 0) {
        setHabitTimers((prev) => ({
          ...prev,
          [newHabit.id]: {
            plannedSeconds,
            remainingSeconds: plannedSeconds,
            status: "idle",
          },
        }));
      }

      setHabits((prev) => [...prev, newHabit]);
      setTitle("");
      setTimerMode("none");
      setTimerHours("00");
      setTimerMinutes("00");
      setTimerSeconds("00");
      setFormValidationError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleHabit = async (id, currentCompleted) => {
    try {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update habit");
      }

      const updatedHabit = await response.json();

      if (!currentCompleted && activeHabitId === id) {
        setActiveHabitId(null);
        setHabitTimers((prev) => {
          if (!prev[id]) return prev;
          return {
            ...prev,
            [id]: { ...prev[id], status: "paused" },
          };
        });
      }

      setHabits((prev) => prev.map((h) => (h.id === id ? updatedHabit : h)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete habit");
      }

      if (activeHabitId === id) setActiveHabitId(null);

      setHabits((prev) => prev.filter((h) => h.id !== id));

      setHabitElements((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      setHabitTimers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartTimer = (id) => {
    if (activeHabitId && activeHabitId !== id) {
      setHabitTimers((prev) => {
        if (!prev[activeHabitId]) return prev;
        return {
          ...prev,
          [activeHabitId]: { ...prev[activeHabitId], status: "paused" },
        };
      });
    }

    setHabitTimers((prev) => {
      const target = prev[id];
      if (!target) return prev;
      return {
        ...prev,
        [id]: { ...target, status: "running" },
      };
    });

    setActiveHabitId(id);
  };

  const handlePauseTimer = (id) => {
    if (activeHabitId === id) setActiveHabitId(null);
    setHabitTimers((prev) => {
      const target = prev[id];
      if (!target) return prev;
      return {
        ...prev,
        [id]: { ...target, status: "paused" },
      };
    });
  };

  const handleResetTimer = (id) => {
    if (activeHabitId === id) setActiveHabitId(null);
    setHabitTimers((prev) => {
      const target = prev[id];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          remainingSeconds: target.plannedSeconds,
          status: "idle",
        },
      };
    });
  };

  const handleSetTimerForHabit = (id, plannedSec) => {
    setHabitTimers((prev) => ({
      ...prev,
      [id]: {
        plannedSeconds: plannedSec,
        remainingSeconds: plannedSec,
        status: "idle",
      },
    }));
  };

  const handleConfirmFinishAnyway = async () => {
    if (!prematureModalData) return;
    const { id } = prematureModalData;
    setPrematureModalData(null);
    await toggleHabit(id, false);
  };

  const handleConfirmAddMoreTime = () => {
    if (!addTimeModalData) return;
    const h = parseInt(addTimeH, 10) || 0;
    const m = parseInt(addTimeM, 10) || 0;
    const s = parseInt(addTimeS, 10) || 0;

    if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) {
      setAddTimeError("Valid bounds: H >= 0, M 0–59, S 0–59.");
      return;
    }
    const addedSec = h * 3600 + m * 60 + s;
    if (addedSec <= 0) {
      setAddTimeError("Please enter a time greater than 0 seconds.");
      return;
    }

    const { id } = addTimeModalData;
    setHabitTimers((prev) => {
      const target = prev[id] || { plannedSeconds: 0, remainingSeconds: 0, status: "idle" };
      return {
        ...prev,
        [id]: {
          plannedSeconds: target.plannedSeconds + addedSec,
          remainingSeconds: target.remainingSeconds + addedSec,
          status: "paused",
        },
      };
    });

    setAddTimeModalData(null);
    setAddTimeError("");
  };

  const focusInput = () => {
    const input = document.getElementById("habit-input");
    if (input) input.focus();
  };

  const activeHabitObj = activeHabitId
    ? habits.find((h) => h.id === activeHabitId)
    : habits.find((h) => habitTimers[h.id] && habitTimers[h.id].status === "running") ||
      habits.find((h) => habitTimers[h.id] && habitTimers[h.id].plannedSeconds > 0 && !h.completed);

  const activeTimerData = activeHabitObj
    ? {
        ...activeHabitObj,
        elementKey: getHabitElementKey(activeHabitObj.title, habitElements[activeHabitObj.id]),
        timer: habitTimers[activeHabitObj.id],
      }
    : null;

  if (loading) {
    return (
      <div className="page habits-page">
        <div className="container">
          <Loading />
        </div>
      </div>
    );
  }

  if (error && habits.length === 0) {
    return (
      <div className="page habits-page">
        <div className="container">
          <ErrorMessage message={error} onRetry={fetchHabits} />
        </div>
      </div>
    );
  }

  return (
    <div className="page habits-page">
      <div ref={confettiContainerRef} aria-hidden="true" />

      <div className="container">
        <div className="habits-header">
          <h1>My Daily Habits</h1>
          <p>Small actions. Better days.</p>
        </div>

        <div className="daily-quote">
          <p>&ldquo;{quote}&rdquo;</p>
        </div>

        <div className="stats-section">
          <div className="stat-card total">
            <div className="stat-number">{totalHabits}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{completedHabits}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pendingHabits}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-top">
            <span className="progress-label">Today&apos;s Progress</span>
            <span className="progress-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${completedHabits} of ${totalHabits} habits completed`}
            ></div>
          </div>
          <div className="motivational-message">
            {motivation.text}
            {totalHabits > 0 && ` — ${completedHabits} / ${totalHabits} completed`}
          </div>
        </div>

        {error && habits.length > 0 && (
          <div className="error-container" style={{ maxWidth: "100%", margin: "0 0 20px 0" }}>
            <p style={{ margin: 0 }}>⚠️ {error}</p>
            <button className="btn-retry" onClick={() => setError(null)} style={{ marginTop: "10px" }}>
              Dismiss
            </button>
          </div>
        )}

        {isPerfectDay && (
          <div className="perfect-day">
            <h2>Perfect Day!</h2>
            <p>You completed every habit on your list. Amazing work!</p>
          </div>
        )}

        <form className="add-habit-form-container" onSubmit={addHabit}>
          <div className="add-habit-form">
            <input
              id="habit-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a new habit..."
              aria-label="New habit title"
            />
            <button type="submit" className="btn-add" disabled={!title.trim()}>
              + Add Habit
            </button>
          </div>

          <div className="element-selector-wrap">
            <div className="element-selector-header">
              <span className="element-selector-title">Choose your nature element:</span>
              <span className="element-selector-active-label">
                Selected: <strong>{ELEMENTS[selectedElement]?.name}</strong>
              </span>
            </div>

            <div className="element-selector-options" role="radiogroup" aria-label="Nature element selection">
              {Object.values(ELEMENTS).map((el) => {
                const isSelected = selectedElement === el.key;
                return (
                  <button
                    key={el.key}
                    type="button"
                    className={`element-select-btn el-btn-${el.key} ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedElement(el.key)}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${el.name} element`}
                  >
                    <img src={el.icon} alt={el.name} width="16" height="16" />
                    <span className="el-btn-name">{el.name}</span>
                    {isSelected && <span className="el-btn-checkmark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="optional-timer-wrap">
            <div className="optional-timer-header">
              <span className="optional-timer-title">Optional planned focus time:</span>
              <span className="optional-timer-hint">(Presets or custom duration)</span>
            </div>

            <div className="timer-mode-selector form-presets-row">
              <button
                type="button"
                className={`btn-mode-preset ${timerMode === "none" ? "active" : ""}`}
                onClick={() => {
                  setTimerMode("none");
                  setTimerHours("00");
                  setTimerMinutes("00");
                  setTimerSeconds("00");
                }}
              >
                No Timer
              </button>
              <button
                type="button"
                className={`btn-mode-preset ${timerMode === "15" ? "active" : ""}`}
                onClick={() => handlePresetClick("15", 15)}
              >
                15 min
              </button>
              <button
                type="button"
                className={`btn-mode-preset ${timerMode === "25" ? "active" : ""}`}
                onClick={() => handlePresetClick("25", 25)}
              >
                25 min
              </button>
              <button
                type="button"
                className={`btn-mode-preset ${timerMode === "45" ? "active" : ""}`}
                onClick={() => handlePresetClick("45", 45)}
              >
                45 min
              </button>
              <button
                type="button"
                className={`btn-mode-preset ${timerMode === "custom" ? "active" : ""}`}
                onClick={() => setTimerMode("custom")}
              >
                Custom
              </button>
            </div>

            {timerMode === "custom" && (
              <div className="optional-timer-inputs">
                <div className="opt-timer-field">
                  <label htmlFor="form-hours">Hours</label>
                  <input
                    id="form-hours"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={timerHours}
                    onChange={(e) => setTimerHours(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
                <span className="opt-timer-colon">:</span>
                <div className="opt-timer-field">
                  <label htmlFor="form-minutes">Minutes</label>
                  <input
                    id="form-minutes"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
                <span className="opt-timer-colon">:</span>
                <div className="opt-timer-field">
                  <label htmlFor="form-seconds">Seconds</label>
                  <input
                    id="form-seconds"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
              </div>
            )}

            {formValidationError && (
              <div className="timer-validation-error" role="alert">
                ⚠️ {formValidationError}
              </div>
            )}
          </div>
        </form>

        {habits.length > 0 ? (
          <div className="habits-grid">
            {habits.map((habit) => {
              const elementKey = getHabitElementKey(habit.title, habitElements[habit.id]);
              const timer = habitTimers[habit.id];

              return (
                <HabitCard
                  key={habit.id}
                  id={habit.id}
                  title={habit.title}
                  completed={habit.completed}
                  elementKey={elementKey}
                  timer={timer}
                  onToggle={() => toggleHabit(habit.id, habit.completed)}
                  onDelete={() => deleteHabit(habit.id)}
                  onStartTimer={handleStartTimer}
                  onPauseTimer={handlePauseTimer}
                  onResetTimer={handleResetTimer}
                  onSetTimerForHabit={handleSetTimerForHabit}
                  onOpenAddMoreTime={(id) => {
                    setAddTimeModalData({ id });
                    setAddTimeH("00");
                    setAddTimeM("30");
                    setAddTimeS("00");
                    setAddTimeError("");
                  }}
                  onRequestPrematureComplete={(modalInfo) => setPrematureModalData(modalInfo)}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your habit list is empty.</h3>
            <p>Ready to start a new routine?</p>
            <button className="btn-empty" onClick={focusInput}>
              + Add Your First Habit
            </button>
          </div>
        )}

        <FocusTimer
          activeHabit={activeTimerData}
          onPause={handlePauseTimer}
          onResume={handleStartTimer}
          onReset={handleResetTimer}
          onMarkComplete={(id) => toggleHabit(id, false)}
          onOpenAddMoreTime={(id) => {
            setAddTimeModalData({ id });
            setAddTimeH("00");
            setAddTimeM("30");
            setAddTimeS("00");
            setAddTimeError("");
          }}
        />

        {prematureModalData && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card premature-modal">
              <h3>Finish Early?</h3>
              <p>
                You still have <strong>{formatTimeHHMMSS(prematureModalData.remainingSeconds)}</strong> remaining on your planned focus time for <strong>&ldquo;{prematureModalData.title}&rdquo;</strong>.
              </p>
              <p className="modal-subtext">Are you sure you want to finish this habit for today?</p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setPrematureModalData(null)}
                >
                  Keep Working
                </button>
                <button
                  type="button"
                  className="btn-modal-primary"
                  onClick={handleConfirmFinishAnyway}
                >
                  Finish Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {addTimeModalData && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card add-time-modal">
              <h3>Add More Focus Time</h3>
              <p>Enter additional focus time to extend your session:</p>

              <div className="custom-inputs-row" style={{ margin: "16px 0" }}>
                <div className="custom-input-group">
                  <label htmlFor="add-h">Hours</label>
                  <input
                    id="add-h"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={addTimeH}
                    onChange={(e) => setAddTimeH(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
                <span className="time-colon">:</span>
                <div className="custom-input-group">
                  <label htmlFor="add-m">Minutes</label>
                  <input
                    id="add-m"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={addTimeM}
                    onChange={(e) => setAddTimeM(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
                <span className="time-colon">:</span>
                <div className="custom-input-group">
                  <label htmlFor="add-s">Seconds</label>
                  <input
                    id="add-s"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={addTimeS}
                    onChange={(e) => setAddTimeS(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                </div>
              </div>

              {addTimeError && <div className="timer-validation-error">⚠️ {addTimeError}</div>}

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setAddTimeModalData(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal-primary"
                  onClick={handleConfirmAddMoreTime}
                >
                  + Add Time & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;
