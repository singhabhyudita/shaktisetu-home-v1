import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Testimonials from "../Testimonials";
import { TESTIMONIALS } from "../../../../data/siteContent";

describe("Testimonials", () => {
  it("renders correctly", () => {
    render(<Testimonials />);
    expect(screen.getByText("Voices of Success")).toBeInTheDocument();

    // Check recruiter testimonials
    TESTIMONIALS.recruiters.forEach((t) => {
      expect(screen.getByText(t.quote)).toBeInTheDocument();
      expect(screen.getByText(t.author)).toBeInTheDocument();
    });

    // Check candidate testimonials
    TESTIMONIALS.candidates.forEach((t) => {
      expect(screen.getByText(t.quote)).toBeInTheDocument();
      expect(screen.getByText(t.author)).toBeInTheDocument();
    });
  });

  it("handles dot pagination clicks", () => {
    render(<Testimonials />);
    const dots = document.querySelectorAll(".dot");
    fireEvent.click(dots[1]); // Click second dot of recruiters
    expect(dots[1]).toHaveClass("active");

    fireEvent.click(dots[dots.length - 1]); // Click last dot (candidate)
    expect(dots[dots.length - 1]).toHaveClass("active");
  });

  it("handles arrow navigation", () => {
    render(<Testimonials />);
    const nextButtons = screen.getAllByText("→");
    const prevButtons = screen.getAllByText("←");

    // Recruiters next
    fireEvent.click(nextButtons[0]);
    // Recruiters prev
    fireEvent.click(prevButtons[0]);

    // Candidates next
    fireEvent.click(nextButtons[1]);
    // Candidates prev
    fireEvent.click(prevButtons[1]);
  });

  it("renders with mobile transform", () => {
    global.innerWidth = 500;
    render(<Testimonials />);
    // This hits the branch in transform style calculation
    expect(screen.getByText("Voices of Success")).toBeInTheDocument();
  });
});
