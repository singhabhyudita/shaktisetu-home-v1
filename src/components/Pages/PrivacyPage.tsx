import React, { useEffect } from "react";
import { PRIVACY_CONTENT, SITE_INFO } from "../../data/siteContent";
import PageHeader from "../Common/PageHeader";
import "./LegalPage.css";

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper to parse content into sections
  const sections: { title: string; content: string[] }[] = [];
  let currentSection: { title: string; content: string[] } | null = null;

  PRIVACY_CONTENT.forEach((line, idx) => {
    if (idx < 2) return; // Main title and intro handled separately
    if (line.match(/^\d+\./)) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: line, content: [] };
    } else if (currentSection && line !== "") {
      currentSection.content.push(line);
    }
  });
  if (currentSection) sections.push(currentSection);

  return (
    <div className="legal-page privacy-page">
      <PageHeader title={PRIVACY_CONTENT[0]} />

      <div className="legal-layout">
        <aside className="legal-nav">
          <span className="legal-nav-title">Policy Overview</span>
          <ul>
            {sections.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`}>{s.title.split(". ")[1]}</a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="legal-main-content">
          {sections.map((s, i) => (
            <section key={i} id={`section-${i}`}>
              <h2>{s.title}</h2>
              <div className="legal-text-block">
                {s.content.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="contact-info-block">
            <h3 className="text-gradient">Grievance Officer</h3>
            <p>
              <strong>Name:</strong> {SITE_INFO.grievanceOfficer}
            </p>
            <p>
              <strong>Email:</strong> {SITE_INFO.email}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPage;
