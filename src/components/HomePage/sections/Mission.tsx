import React from "react";
import { MISSION_CONTENT } from "../../../data/siteContent";

const Mission: React.FC = () => {
  return (
    <section id="mission" className="mission-section">
      <div className="mission-container">
        <h2 className="text-gradient">{MISSION_CONTENT.title}</h2>
        <p>{MISSION_CONTENT.text}</p>
      </div>
    </section>
  );
};

export default Mission;
