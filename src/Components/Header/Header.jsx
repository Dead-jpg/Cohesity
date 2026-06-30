import { useState } from "react";
import Banner1 from "../../assets/banner1.png";
import "./Header.css";

const Header = ({ openregister }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={Banner1} alt="Cohesity Logo" className="cohesity-logo" />
          <div className="header-divider"></div>
          <img
            src="https://d3m889aznlr23d.cloudfront.net/img/events/id/459/459330079/assets/eff235041018fd64aa7a327169e319e8.semperis.png"
            alt="Semperis Logo"
            className="semperis-logo"
          />
        </div>

        
        <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <button className="mobile-close-btn" onClick={closeMenu} aria-label="Close Menu">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <a href="#overview" className="nav-item" onClick={closeMenu}>Overview</a>
          <a href="#why-attend" className="nav-item" onClick={closeMenu}>Why attend?</a>
          <a href="#agenda" className="nav-item" onClick={closeMenu}>Agenda</a>
          <a href="#venue" className="nav-item" onClick={closeMenu}>Venue</a>
          <button
            className="register-btn mobile-drawer-register"
            onClick={() => {
              closeMenu();
              openregister();
            }}
          >
            REGISTER
          </button>
        </nav>

        <div className="header-right">
          <button className="register-btn header-register-btn" onClick={openregister}>
            REGISTER
          </button>
          <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Menu">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;
