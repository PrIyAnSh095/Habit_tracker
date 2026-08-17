import { useState } from "react";
import { NavLink } from "react-router-dom";
import waterAsset from "../assets/water.svg";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon" aria-hidden="true">
            <img src={waterAsset} alt="Habits logo" width="20" height="20" />
          </span>
          Daily Habits
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/habits" onClick={closeMenu}>
            Habits
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
