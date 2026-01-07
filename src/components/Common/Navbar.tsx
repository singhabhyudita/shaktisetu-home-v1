import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle anchor links on home page vs other pages
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") return;
    if (!target.startsWith("#")) return;

    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}
    >
      <div className="nav-container">
        <div className="logo">
          <Link
            to="/"
            className="logo-text"
            onClick={() => setIsMenuOpen(false)}
          >
            ShaktiSetu
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          {location.pathname === "/" ? (
            <>
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, "#features")}
              >
                Features
              </a>
              <a
                href="https://portal.shaktisetu.com"
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Employer Portal
              </a>
              <a
                href="#download"
                className="navbar-btn-primary"
                onClick={(e) => handleNavClick(e, "#download")}
              >
                Get the App
              </a>
            </>
          ) : (
            <>
              <Link to="/#features" onClick={() => setIsMenuOpen(false)}>
                Features
              </Link>
              <a
                href="https://portal.shaktisetu.com"
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Employer Portal
              </a>
              <Link
                to="/#download"
                className="navbar-btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Get the App
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
