import React, { useState, useEffect, useCallback } from "react";
import { TESTIMONIALS } from "../../../data/siteContent";
import "./Testimonials.css";

const Testimonials: React.FC = () => {
  const [empIndex, setEmpIndex] = useState(0);
  const [candIndex, setCandIndex] = useState(0);

  const empCount = TESTIMONIALS.recruiters.length;
  const candCount = TESTIMONIALS.candidates.length;

  const nextEmp = useCallback(
    () => setEmpIndex((prev) => (prev + 1) % empCount),
    [empCount],
  );
  const prevEmp = () => setEmpIndex((prev) => (prev - 1 + empCount) % empCount);

  const nextCand = useCallback(
    () => setCandIndex((prev) => (prev + 1) % candCount),
    [candCount],
  );
  const prevCand = () =>
    setCandIndex((prev) => (prev - 1 + candCount) % candCount);

  /* Autoscroll disabled per user request */
  /*
  useEffect(() => {
    const empTimer = setInterval(nextEmp, 6000);
    const candTimer = setInterval(nextCand, 6500);
    return () => {
      clearInterval(empTimer);
      clearInterval(candTimer);
    };
  }, [nextEmp, nextCand]);
  */

  const renderSlider = (
    list: any[],
    currentIndex: number,
    type: "emp" | "cand",
  ) => {
    return (
      <div className="testimonial-group">
        <h3>{type === "emp" ? "For Employers" : "For Candidates"}</h3>
        <div className="slider-viewport">
          <div
            className="testimonial-slider"
            style={{
              transform: `translateX(-${currentIndex * (window.innerWidth > 968 ? 33.333 : 100)}%)`,
            }}
          >
            {list.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="card-inner">
                  <div className="quote-icon">“</div>
                  <div className="testimonial-content">
                    <p>{t.quote}</p>
                  </div>
                  <div className="author-info">
                    <h4>{t.author}</h4>
                    <span>{t.company || t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button
            className="control-btn"
            onClick={type === "emp" ? prevEmp : prevCand}
          >
            ←
          </button>
          <div className="pagination-dots">
            {list.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${currentIndex === idx ? "active" : ""}`}
                onClick={() =>
                  type === "emp" ? setEmpIndex(idx) : setCandIndex(idx)
                }
              />
            ))}
          </div>
          <button
            className="control-btn"
            onClick={type === "emp" ? nextEmp : nextCand}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="section-title-premium text-gradient">
            Voices of Success
          </h2>
        </div>
        {renderSlider(TESTIMONIALS.recruiters, empIndex, "emp")}
        {renderSlider(TESTIMONIALS.candidates, candIndex, "cand")}
      </div>
    </section>
  );
};

export default Testimonials;
