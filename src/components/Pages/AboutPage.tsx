import React, { useEffect } from "react";
import { ABOUT_CONTENT, SITE_INFO } from "../../data/siteContent";
import PageHeader from "../Common/PageHeader";
import "./LegalPage.css";

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page about-page">
      <PageHeader title="About Us" />

      <section>
        <h2>Our Story</h2>
        <p>{ABOUT_CONTENT.story}</p>
      </section>

      <section>
        <h2>Vision</h2>
        <p>{ABOUT_CONTENT.vision}</p>
      </section>

      <section>
        <h2>Core Beliefs</h2>
        <div className="belief-grid">
          {ABOUT_CONTENT.coreBeliefs.map((belief, idx) => (
            <div key={idx} className="belief-card">
              <h3>{belief.title}</h3>
              <p>{belief.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>AI-Powered Future</h2>
        <p>{ABOUT_CONTENT.aiValuePoint}</p>
      </section>

      <div className="contact-info-block">
        <h3>Contact Information</h3>
        <p>
          <strong>Entity:</strong> {SITE_INFO.companyName}
        </p>
        <p>
          <strong>Email:</strong> {SITE_INFO.email}
        </p>
        <p>
          <strong>Phone:</strong> {SITE_INFO.phone} ({SITE_INFO.supportHours})
        </p>
        <p>
          <strong>Address:</strong> {SITE_INFO.address}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
