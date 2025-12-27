import React from "react";
import { HERO_CONTENT } from "../../../data/siteContent";

const Hero: React.FC = () => {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <div className="hero-brand-top text-gradient">ShaktiSetu</div>
          <h1 className="hero-title text-gradient">
            Unlocking the Potential of India's Workforce
          </h1>
          <p className="hero-subtitle">
            Connecting tech-enabled talent with{" "}
            <strong>verified local opportunities</strong>. From{" "}
            <strong>AI-curated profiles</strong> to one-click hiring, we're
            organizing the future of work, starting with <strong>Mumbai</strong>
            .
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;
