import React from "react";
import "./Pricing.css";

const Pricing: React.FC = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-content">
          <h2 className="section-title-premium text-gradient">
            Transparent Pricing
          </h2>
          <p className="pricing-text">
            Our services start from <strong>₹2,500</strong> per candidate placed
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
