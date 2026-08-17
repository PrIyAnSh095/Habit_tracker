import { useNavigate } from "react-router-dom";
import waterAsset from "../assets/water.svg";
import fireAsset from "../assets/fire.svg";
import earthAsset from "../assets/earth.svg";
import airAsset from "../assets/air.svg";
import lightAsset from "../assets/light.svg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page home-page">
      <div className="home-bg-glows" aria-hidden="true">
        <div className="bg-glow glow-1" />
        <div className="bg-glow glow-2" />
        <div className="bg-glow glow-3" />
      </div>

      <section className="home-hero">
        <div className="container hero-container">
          <div className="hero-badge">
            FULL-STACK HABIT TRACKING APPLICATION
          </div>

          <h1 className="hero-title">
            Build Better Days,<br />
            <span className="hero-highlight">One Habit at a Time.</span>
          </h1>

          <p className="hero-subtitle">
            Transform everyday routines into quiet, visible progress. Powered by nature-element visual personalities, custom focus instruments, and real-time habit tracking.
          </p>

          <div className="hero-cta-group">
            <button className="btn-hero-primary" onClick={() => navigate("/habits")}>
              Start Tracking Habits
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate("/about")}>
              How It Works
            </button>
          </div>

          <div className="starter-habits-section">
            <div className="starter-header">
              <h3>Starter Daily Habits</h3>
              <p>Five default habits to kickstart your daily routine:</p>
            </div>

            <div className="starter-cards-grid">
              <div className="starter-card card-water" onClick={() => navigate("/habits")}>
                <div className="card-top-row">
                  <span className="starter-el-badge badge-water">WATER</span>
                  <span className="starter-timer-badge">15 min focus</span>
                </div>
                <div className="starter-card-body">
                  <div className="starter-icon-wrap icon-water">
                    <img src={waterAsset} alt="Water" width="22" height="22" />
                  </div>
                  <div className="starter-info">
                    <h4>Drink 2L Water</h4>
                    <span className="starter-sub">Consistency & Flow</span>
                  </div>
                </div>
              </div>

              <div className="starter-card card-fire" onClick={() => navigate("/habits")}>
                <div className="card-top-row">
                  <span className="starter-el-badge badge-fire">FIRE</span>
                  <span className="starter-timer-badge">30 min focus</span>
                </div>
                <div className="starter-card-body">
                  <div className="starter-icon-wrap icon-fire">
                    <img src={fireAsset} alt="Fire" width="22" height="22" />
                  </div>
                  <div className="starter-info">
                    <h4>Exercise 30 Mins</h4>
                    <span className="starter-sub">Energy & Momentum</span>
                  </div>
                </div>
              </div>

              <div className="starter-card card-air" onClick={() => navigate("/habits")}>
                <div className="card-top-row">
                  <span className="starter-el-badge badge-air">AIR</span>
                  <span className="starter-timer-badge">20 min focus</span>
                </div>
                <div className="starter-card-body">
                  <div className="starter-icon-wrap icon-air">
                    <img src={airAsset} alt="Air" width="22" height="22" />
                  </div>
                  <div className="starter-info">
                    <h4>Read 20 Minutes</h4>
                    <span className="starter-sub">Focus & Mental Clarity</span>
                  </div>
                </div>
              </div>

              <div className="starter-card card-light" onClick={() => navigate("/habits")}>
                <div className="card-top-row">
                  <span className="starter-el-badge badge-light">LIGHT</span>
                  <span className="starter-timer-badge">1 hr focus</span>
                </div>
                <div className="starter-card-body">
                  <div className="starter-icon-wrap icon-light">
                    <img src={lightAsset} alt="Light" width="22" height="22" />
                  </div>
                  <div className="starter-info">
                    <h4>Practice Coding</h4>
                    <span className="starter-sub">Progress & Mastery</span>
                  </div>
                </div>
              </div>

              <div className="starter-card card-earth" onClick={() => navigate("/habits")}>
                <div className="card-top-row">
                  <span className="starter-el-badge badge-earth">EARTH</span>
                  <span className="starter-timer-badge">8 hr focus</span>
                </div>
                <div className="starter-card-body">
                  <div className="starter-icon-wrap icon-earth">
                    <img src={earthAsset} alt="Earth" width="22" height="22" />
                  </div>
                  <div className="starter-info">
                    <h4>Sleep 8 Hours</h4>
                    <span className="starter-sub">Rest & Foundations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-highlights-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src={waterAsset} alt="Focus Instrument" width="28" height="28" />
              </div>
              <h4>Focus Instruments</h4>
              <p>Per-habit circular countdown clocks with presets (15m, 25m, 45m) and custom HH:MM:SS timing.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <img src={earthAsset} alt="Nature Elements" width="28" height="28" />
              </div>
              <h4>5 Nature Elements</h4>
              <p>Assign Water, Fire, Earth, Air, or Light elements with animated perimeter edge strokes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <img src={lightAsset} alt="Celebration" width="28" height="28" />
              </div>
              <h4>Perfect Day Celebration</h4>
              <p>Complete all daily habits to unlock geometric confetti physics and celebratory rewards.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <img src={fireAsset} alt="REST API" width="28" height="28" />
              </div>
              <h4>Express REST API</h4>
              <p>Full REST CRUD endpoints backed by Node.js, Express, CORS, and reactive state.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
