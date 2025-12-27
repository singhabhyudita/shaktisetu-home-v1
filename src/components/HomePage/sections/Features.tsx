import React, { useState } from "react";
import { FEATURES_CONTENT } from "../../../data/siteContent";
import "./Features.css";

const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"talent" | "employer">("talent");

  const content =
    activeTab === "talent"
      ? FEATURES_CONTENT.talent
      : FEATURES_CONTENT.employer;

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="section-title-premium text-gradient">
            Everything you need to succeed
          </h2>

          <div className="feature-toggle">
            <button
              className={`toggle-btn ${activeTab === "talent" ? "active" : ""}`}
              onClick={() => setActiveTab("talent")}
            >
              For Candidates
            </button>
            <button
              className={`toggle-btn ${activeTab === "employer" ? "active" : ""}`}
              onClick={() => setActiveTab("employer")}
            >
              For Employers
            </button>
          </div>
        </div>

        <div className="features-display">
          <div className="feature-items-scroll">
            {content.items.map((item, idx) => (
              <div className="feature-item-card" key={idx}>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
