import React from "react";

const Clients: React.FC = () => {
  return (
    <section className="stats-bar">
      <div className="stat-item">
        <h3>Verified</h3>
        <p>Profiles</p>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <h3>Top</h3>
        <p>Employers</p>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <h3>0%</h3>
        <p>Hidden Fees</p>
      </div>
    </section>
  );
};

export default Clients;
