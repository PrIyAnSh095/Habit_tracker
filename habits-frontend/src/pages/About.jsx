import { useState } from "react";
import waterAsset from "../assets/water.svg";
import fireAsset from "../assets/fire.svg";
import earthAsset from "../assets/earth.svg";
import airAsset from "../assets/air.svg";
import lightAsset from "../assets/light.svg";

const ABOUT_ELEMENTS = [
  {
    key: "water",
    name: "WATER",
    tagline: "Flow",
    icon: waterAsset,
    color: "#2B7FFF",
    bg: "#E6F3FF",
    description: "Represents consistency, adaptability, and calm, uninterrupted progress.",
  },
  {
    key: "fire",
    name: "FIRE",
    tagline: "Energy",
    icon: fireAsset,
    color: "#FF4D4D",
    bg: "#FFEBEB",
    description: "Represents action, motivation, high-intensity focus, and building momentum.",
  },
  {
    key: "earth",
    name: "EARTH",
    tagline: "Growth",
    icon: earthAsset,
    color: "#2E8B57",
    bg: "#EAF7EE",
    description: "Represents stability, discipline, deep-rooted routines, and solid foundations.",
  },
  {
    key: "air",
    name: "AIR",
    tagline: "Clarity",
    icon: airAsset,
    color: "#7097AB",
    bg: "#F0F4F8",
    description: "Represents focus, freedom, mental space, and effortless routine flow.",
  },
  {
    key: "light",
    name: "LIGHT",
    tagline: "Progress",
    icon: lightAsset,
    color: "#FFC107",
    bg: "#FFF9E6",
    description: "Represents achievement, positive momentum, daily wins, and self-belief.",
  },
];

const JOURNEY_STEPS = [
  { step: "01", title: "Create a habit", desc: "Define any daily action you want to build." },
  { step: "02", title: "Choose an element", desc: "Assign a nature element to define its personality." },
  { step: "03", title: "Optionally set focus time", desc: "Preset 15m/25m/45m or custom HH:MM:SS." },
  { step: "04", title: "Work on the habit", desc: "Run your focus session with countdown instrument." },
  { step: "05", title: "Complete it", desc: "Trigger perimeter edge animations & celebrate." },
  { step: "06", title: "Watch your progress grow", desc: "Track daily stats and achieve Perfect Days." },
];

function About() {
  const [activeElementKey, setActiveElementKey] = useState("water");
  const activeElement = ABOUT_ELEMENTS.find((e) => e.key === activeElementKey) || ABOUT_ELEMENTS[0];

  return (
    <div className="page about-page">
      <div className="container">
        <section className="about-hero">
          <span className="about-hero-badge">PRODUCT & ARCHITECTURE GUIDE</span>
          <h1>Build better days through small actions.</h1>
          <p className="about-hero-sub">
            <strong>Daily Habit Tracker</strong> turns everyday routines into simple, visible progress — one habit at a time.
          </p>
        </section>

        <section className="about-section elements-showcase">
          <div className="section-title-wrap">
            <h2>The Five Nature Elements</h2>
            <p>Select an element to preview its visual personality and completion edge animation.</p>
          </div>

          <div className="elements-tab-row" role="tablist">
            {ABOUT_ELEMENTS.map((el) => (
              <button
                key={el.key}
                className={`element-tab-btn el-tab-${el.key} ${activeElementKey === el.key ? "active" : ""}`}
                onClick={() => setActiveElementKey(el.key)}
                role="tab"
                aria-selected={activeElementKey === el.key}
              >
                <span className="tab-icon">
                  <img src={el.icon} alt={el.name} width="16" height="16" />
                </span>
                <span className="tab-name">{el.name}</span>
              </button>
            ))}
          </div>

          <div className={`active-element-card element-${activeElement.key}`}>
            <svg className="card-edge-svg active" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <rect
                className={`edge-path edge-path-${activeElement.key}`}
                x="1"
                y="1"
                width="98"
                height="98"
                rx="5"
                ry="5"
                pathLength="100"
                vectorEffect="non-scaling-stroke"
                style={{ animationDuration: "2s", animationIterationCount: "infinite" }}
              />
            </svg>

            <div className="active-element-content">
              <div className="element-badge-large" style={{ background: activeElement.bg, color: activeElement.color, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <img src={activeElement.icon} alt={activeElement.name} width="18" height="18" /> {activeElement.name} — {activeElement.tagline}
              </div>
              <h3>{activeElement.tagline}</h3>
              <p>{activeElement.description}</p>
              <div className="animation-preview-note">
                Perimeter edge animation currently previewing live on card boundary above!
              </div>
            </div>
          </div>
        </section>

        <section className="about-section how-it-works">
          <div className="section-title-wrap">
            <h2>How It Works</h2>
            <p>A simple step-by-step path from setting intentions to building lasting momentum.</p>
          </div>

          <div className="journey-grid">
            {JOURNEY_STEPS.map((item, idx) => (
              <div key={item.step} className="journey-card">
                <div className="journey-num">{item.step}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                {idx < JOURNEY_STEPS.length - 1 && <div className="journey-arrow">➔</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="about-section architecture-section">
          <div className="section-title-wrap">
            <h2>Behind the Scenes Architecture</h2>
            <p>Designed strictly in alignment with Practical 1–4 full-stack syllabus requirements.</p>
          </div>

          <div className="arch-flow-box">
            <div className="flow-node node-react">
              <span className="node-tag">FRONTEND</span>
              <strong>React 19 + Vite</strong>
              <span>State & Controls</span>
            </div>
            <div className="flow-arrow">➔ Fetch API ➔</div>
            <div className="flow-node node-express">
              <span className="node-tag">BACKEND</span>
              <strong>Node.js + Express</strong>
              <span>REST API Endpoint</span>
            </div>
            <div className="flow-arrow">➔ Array ➔</div>
            <div className="flow-node node-memory">
              <span className="node-tag">DATA MODEL</span>
              <strong>habits[]</strong>
              <span>{"{ id, title, completed }"}</span>
            </div>
          </div>

          <div className="syllabus-grid">
            <div className="syllabus-card">
              <h4>Practical 1</h4>
              <ul>
                <li>JSX Syntax & Elements</li>
                <li>Functional Components</li>
                <li>Component Reusability & Props</li>
              </ul>
            </div>
            <div className="syllabus-card">
              <h4>Practical 2</h4>
              <ul>
                <li>React useState Hook</li>
                <li>Controlled Form Inputs</li>
                <li>React Router SPA Navigation</li>
              </ul>
            </div>
            <div className="syllabus-card">
              <h4>Practical 3</h4>
              <ul>
                <li>useEffect Lifecycle Integration</li>
                <li>REST API Integration (Fetch)</li>
                <li>Loading & Error State Handling</li>
              </ul>
            </div>
            <div className="syllabus-card">
              <h4>Practical 4</h4>
              <ul>
                <li>Node.js & Express REST API</li>
                <li>Complete CRUD Endpoints</li>
                <li>CORS Middleware & Memory Storage</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-closing">
          <h3>Small habits. Real progress.</h3>
          <p>
            The goal isn&apos;t to do everything perfectly. It&apos;s to make progress that you can actually see.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
