import React from "react";
import { SITE_INFO } from "../../../data/siteContent";
import "./CTA.css";

const CTA: React.FC = () => {
  return (
    <section id="download" className="cta-section">
      <div className="cta-container">
        <h2 className="section-title-premium text-gradient">
          Ready to get started?
        </h2>
        <div className="cta-buttons">
          <a
            href={SITE_INFO.appleStoreUrl}
            className="store-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="store-icon"></div>
            <div className="store-text">
              <span>Download on the</span>
              <strong>App Store</strong>
            </div>
          </a>
          <a
            href={SITE_INFO.playStoreUrl}
            className="store-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="store-icon">▶</div>
            <div className="store-text">
              <span>GET IT ON</span>
              <strong>Google Play</strong>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
