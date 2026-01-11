import React, { useEffect } from "react";
import { REFUND_CONTENT, SITE_INFO } from "../../data/siteContent";
import PageHeader from "../Common/PageHeader";
import "./LegalPage.css";

const RefundPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper to parse content into sections
  const sections: { title: string; content: string[] }[] = [];
  let currentSection: { title: string; content: string[] } | null = null;

  REFUND_CONTENT.forEach((line, idx) => {
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
    <div className="legal-page refund-page">
      <PageHeader title={REFUND_CONTENT[0]} />

      <div
        className={`legal-layout ${sections.length === 0 ? "no-sidebar" : ""}`}
      >
        {sections.length > 0 && (
          <aside className="legal-nav">
            <span className="legal-nav-title">Policy Sections</span>
            <ul>
              {sections.map((s, i) => (
                <li key={i}>
                  <a href={`#section-${i}`}>{s.title.split(". ")[1]}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <main className="legal-main-content">
          <p className="legal-intro">{REFUND_CONTENT[1]}</p>
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
            <h3 className="text-gradient">Support & Grievances</h3>
            <p>
              <strong>Email:</strong> {SITE_INFO.email}
            </p>
            <p>
              <strong>Phone:</strong> {SITE_INFO.phone}
            </p>
            <p>
              <strong>Address:</strong> {SITE_INFO.address}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RefundPage;
