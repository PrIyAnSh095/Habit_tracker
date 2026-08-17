import { useState } from "react";
import waterAsset from "../assets/water.svg";
import fireAsset from "../assets/fire.svg";
import earthAsset from "../assets/earth.svg";
import airAsset from "../assets/air.svg";
import lightAsset from "../assets/light.svg";

export const ELEMENTS = {
  water: {
    key: "water",
    name: "WATER",
    icon: waterAsset,
    color: "#2B7FFF",
    motto: "Flow & Consistency",
  },
  fire: {
    key: "fire",
    name: "FIRE",
    icon: fireAsset,
    color: "#FF4D4D",
    motto: "Energy & Action",
  },
  earth: {
    key: "earth",
    name: "EARTH",
    icon: earthAsset,
    color: "#2E8B57",
    motto: "Growth & Stability",
  },
  air: {
    key: "air",
    name: "AIR",
    icon: airAsset,
    color: "#7097AB",
    motto: "Focus & Clarity",
  },
  light: {
    key: "light",
    name: "LIGHT",
    icon: lightAsset,
    color: "#FFC107",
    motto: "Progress & Positivity",
  },
};

export function getHabitElementKey(title, customElementKey) {
  if (customElementKey && ELEMENTS[customElementKey]) {
    return customElementKey;
  }
  const lower = title.toLowerCase();
  if (lower.includes("water") || lower.includes("drink")) return "water";
  if (lower.includes("exercise") || lower.includes("run") || lower.includes("workout")) return "fire";
  if (lower.includes("read") || lower.includes("book")) return "air";
  if (lower.includes("code") || lower.includes("coding")) return "light";
  if (lower.includes("sleep") || lower.includes("rest")) return "earth";

  if (lower.includes("meditat") || lower.includes("mindful")) return "air";
  if (lower.includes("journal") || lower.includes("write")) return "earth";
  if (lower.includes("cook") || lower.includes("eat")) return "fire";
  if (lower.includes("learn") || lower.includes("study")) return "light";

  return "water";
}

function formatTimeHHMMSS(totalSec) {
  if (!totalSec || totalSec <= 0 || isNaN(totalSec)) return "00:00:00";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function HabitCard({
  id,
  title,
  completed,
  elementKey = "water",
  timer,
  onToggle,
  onDelete,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onOpenAddMoreTime,
  onSetTimerForHabit,
  onRequestPrematureComplete,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [showTimeEditor, setShowTimeEditor] = useState(false);
  const [showRunningGuardModal, setShowRunningGuardModal] = useState(false);
  const [editorMode, setEditorMode] = useState("custom");
  const [editH, setEditH] = useState("00");
  const [editM, setEditM] = useState("25");
  const [editS, setEditS] = useState("00");
  const [editError, setEditError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const element = ELEMENTS[elementKey] || ELEMENTS.water;
  const hasValidTimer = timer && timer.plannedSeconds > 0;
  const isTimerRunning = hasValidTimer && timer.status === "running";
  const isTimerPaused = hasValidTimer && timer.status === "paused";
  const isTimerFinished = hasValidTimer && timer.remainingSeconds === 0;

  const handleToggleClick = () => {
    if (completed) {
      onToggle();
      return;
    }

    if (hasValidTimer && timer.remainingSeconds > 0 && !isTimerFinished) {
      onRequestPrematureComplete({ id, title, remainingSeconds: timer.remainingSeconds });
      return;
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 1600);
    onToggle();
  };

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete();
  };
  const handleCancelDelete = () => setShowConfirm(false);

  const handleEditTimeClick = () => {
    if (isTimerRunning) {
      setShowRunningGuardModal(true);
      return;
    }
    openEditor();
  };

  const openEditor = () => {
    setShowTimeEditor(true);
    if (hasValidTimer) {
      const h = Math.floor(timer.plannedSeconds / 3600);
      const m = Math.floor((timer.plannedSeconds % 3600) / 60);
      const s = timer.plannedSeconds % 60;
      setEditH(h.toString().padStart(2, "0"));
      setEditM(m.toString().padStart(2, "0"));
      setEditS(s.toString().padStart(2, "0"));
      setEditorMode("custom");
    } else {
      setEditH("00");
      setEditM("25");
      setEditS("00");
      setEditorMode("25");
    }
    setEditError("");
  };

  const handlePauseAndEdit = () => {
    setShowRunningGuardModal(false);
    onPauseTimer(id);
    openEditor();
  };

  const handlePresetSelectInEditor = (mode, mins) => {
    setEditorMode(mode);
    if (mode === "none") {
      setEditH("00");
      setEditM("00");
      setEditS("00");
      setEditError("");
      return;
    }
    if (mins > 0) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      setEditH(h.toString().padStart(2, "0"));
      setEditM(m.toString().padStart(2, "0"));
      setEditS("00");
      setEditError("");
    }
  };

  const handleSaveTimerEditor = () => {
    if (editorMode === "none") {
      onSetTimerForHabit(id, 0);
      setShowTimeEditor(false);
      showToast("Timer removed.");
      return;
    }

    const h = parseInt(editH, 10) || 0;
    const m = parseInt(editM, 10) || 0;
    const s = parseInt(editS, 10) || 0;

    if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) {
      setEditError("Valid bounds: Hours >= 0, Minutes 0–59, Seconds 0–59.");
      return;
    }

    const totalSec = h * 3600 + m * 60 + s;
    if (totalSec <= 0) {
      onSetTimerForHabit(id, 0);
      setShowTimeEditor(false);
      showToast("Timer removed.");
      return;
    }

    onSetTimerForHabit(id, totalSec);
    setShowTimeEditor(false);
    showToast("Focus time updated.");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  return (
    <div
      className={`habit-card habit-card-element element-${element.key} ${completed ? "completed" : ""} ${
        animating ? `edge-animating-${element.key}` : ""
      } ${completed ? `edge-completed-${element.key}` : ""} ${isTimerRunning ? "card-timer-active" : ""}`}
    >
      {toastMessage && (
        <div className="card-toast-banner" role="status">
          {toastMessage}
        </div>
      )}

      <svg
        className={`card-edge-svg ${animating || completed ? "active" : ""}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          className={`edge-path edge-path-${element.key}`}
          x="1"
          y="1"
          width="98"
          height="98"
          rx="5"
          ry="5"
          pathLength="100"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="card-element-header">
        <span className={`element-badge badge-${element.key}`}>
          <img src={element.icon} alt={element.name} className="badge-icon-img" width="16" height="16" />
          <span className="badge-name">{element.name}</span>
        </span>
        {hasValidTimer && (
          <span className="card-timer-badge">
            {formatTimeHHMMSS(timer.plannedSeconds)}
          </span>
        )}
      </div>

      <div className="habit-card-top">
        <div className={`habit-emoji habit-emoji-${element.key}`} aria-hidden="true">
          <img src={element.icon} alt={element.name} width="24" height="24" />
        </div>

        <div className="habit-info">
          <h3 className="habit-title">{title}</h3>
          <span className={`habit-status ${completed ? "done" : "pending"}`}>
            <span className="status-dot" aria-hidden="true"></span>
            {completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>

      {!completed && (
        <>
          {showTimeEditor && (
            <div className="card-inline-timer-editor">
              <div className="editor-header-row">
                <span className="editor-title">Configure Focus Time:</span>
                <button
                  type="button"
                  className="btn-editor-close"
                  onClick={() => setShowTimeEditor(false)}
                >
                  ✕
                </button>
              </div>

              <div className="timer-mode-selector form-presets-row" style={{ marginTop: "6px" }}>
                <button
                  type="button"
                  className={`btn-mode-preset ${editorMode === "15" ? "active" : ""}`}
                  onClick={() => handlePresetSelectInEditor("15", 15)}
                >
                  15 min
                </button>
                <button
                  type="button"
                  className={`btn-mode-preset ${editorMode === "25" ? "active" : ""}`}
                  onClick={() => handlePresetSelectInEditor("25", 25)}
                >
                  25 min
                </button>
                <button
                  type="button"
                  className={`btn-mode-preset ${editorMode === "45" ? "active" : ""}`}
                  onClick={() => handlePresetSelectInEditor("45", 45)}
                >
                  45 min
                </button>
                <button
                  type="button"
                  className={`btn-mode-preset ${editorMode === "custom" ? "active" : ""}`}
                  onClick={() => setEditorMode("custom")}
                >
                  Custom
                </button>
                <button
                  type="button"
                  className={`btn-mode-preset btn-preset-none ${editorMode === "none" ? "active" : ""}`}
                  onClick={() => handlePresetSelectInEditor("none", 0)}
                >
                  No Timer
                </button>
              </div>

              {editorMode === "custom" && (
                <div className="custom-inputs-row inline-timer-row">
                  <div className="custom-input-group">
                    <label>Hours</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={editH}
                      onChange={(e) => setEditH(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    />
                  </div>
                  <span className="time-colon">:</span>
                  <div className="custom-input-group">
                    <label>Minutes</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={editM}
                      onChange={(e) => setEditM(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    />
                  </div>
                  <span className="time-colon">:</span>
                  <div className="custom-input-group">
                    <label>Seconds</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={editS}
                      onChange={(e) => setEditS(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    />
                  </div>
                </div>
              )}

              {editError && <div className="timer-validation-error">{editError}</div>}

              <div className="inline-editor-actions">
                <button
                  type="button"
                  className="btn-card-timer btn-reset-focus"
                  onClick={() => setShowTimeEditor(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-card-timer btn-start-focus"
                  onClick={handleSaveTimerEditor}
                >
                  Save Time
                </button>
              </div>
            </div>
          )}

          {!hasValidTimer && !showTimeEditor && (
            <div className="card-no-timer-block">
              <div className="no-timer-text">
                <strong>No focus session planned</strong>
                <span>You can add one anytime.</span>
              </div>
              <button
                type="button"
                className="btn-card-timer btn-set-timer"
                onClick={openEditor}
              >
                + Set Focus Time
              </button>
            </div>
          )}

          {hasValidTimer && !showTimeEditor && (
            <div className="card-timer-block">
              <div className="card-timer-meta">
                <span className="meta-planned">
                  {isTimerRunning ? "Focus session" : isTimerPaused ? "Focus paused" : isTimerFinished ? "Focus time complete" : "Focus time"}
                </span>
                <span className="meta-status">
                  {isTimerRunning && "Active"}
                  {isTimerPaused && "Paused"}
                  {isTimerFinished && "Finished"}
                  {timer.status === "idle" && formatTimeHHMMSS(timer.plannedSeconds)}
                </span>
              </div>

              <div className="card-timer-readout">
                <span className="readout-label">
                  {isTimerRunning || isTimerPaused ? "Remaining:" : "Duration:"}
                </span>
                <span className="readout-time">
                  {formatTimeHHMMSS(timer.remainingSeconds)}
                </span>
              </div>

              <div className="card-timer-actions">
                {!isTimerRunning && !isTimerFinished && (
                  <button
                    type="button"
                    className="btn-card-timer btn-start-focus"
                    onClick={() => onStartTimer(id)}
                  >
                    {isTimerPaused ? "Resume" : "Start Focus"}
                  </button>
                )}

                {isTimerRunning && (
                  <button
                    type="button"
                    className="btn-card-timer btn-pause-focus"
                    onClick={() => onPauseTimer(id)}
                  >
                    Pause
                  </button>
                )}

                <button
                  type="button"
                  className="btn-card-timer btn-edit-time"
                  onClick={handleEditTimeClick}
                >
                  Edit Time
                </button>

                {(isTimerPaused || (timer.remainingSeconds < timer.plannedSeconds && !isTimerFinished)) && (
                  <button
                    type="button"
                    className="btn-card-timer btn-reset-focus"
                    onClick={() => onResetTimer(id)}
                  >
                    Reset
                  </button>
                )}

                {isTimerFinished && (
                  <button
                    type="button"
                    className="btn-card-timer btn-add-more-time"
                    onClick={() => onOpenAddMoreTime(id)}
                  >
                    + Add More Time
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {completed && (
        <div className="card-completed-timer-note">
          Focus session finished {hasValidTimer && `(${formatTimeHHMMSS(timer.plannedSeconds)})`}
        </div>
      )}

      <div className="habit-card-actions">
        {completed ? (
          <button
            className="btn-toggle btn-pending"
            onClick={handleToggleClick}
            aria-label={`Mark ${title} as pending`}
          >
            Mark Pending
          </button>
        ) : (
          <button
            className="btn-toggle btn-complete"
            onClick={handleToggleClick}
            aria-label={`Mark ${title} as complete`}
          >
            Mark Complete
          </button>
        )}

        <button
          className="btn-delete"
          onClick={handleDeleteClick}
          aria-label={`Delete ${title}`}
        >
          Delete
        </button>
      </div>

      {showRunningGuardModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Timer Currently Running</h3>
            <p>
              This focus session is currently running on <strong>&ldquo;{title}&rdquo;</strong>.
            </p>
            <p className="modal-subtext">Pause the session before changing its planned time.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => setShowRunningGuardModal(false)}
              >
                Keep Working
              </button>
              <button
                type="button"
                className="btn-modal-primary"
                onClick={handlePauseAndEdit}
              >
                Pause & Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="delete-confirm">
          <p>Delete this habit?</p>
          <div className="delete-confirm-actions">
            <button className="btn-cancel" onClick={handleCancelDelete}>
              Cancel
            </button>
            <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitCard;
