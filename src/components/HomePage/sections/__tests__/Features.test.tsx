import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Features from "../Features";
import { FEATURES_CONTENT } from "../../../../data/siteContent";

describe("Features", () => {
  it("renders correctly and toggles tabs", () => {
    render(<Features />);

    // Check initial tab (Candidate)
    FEATURES_CONTENT.talent.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.detail)).toBeInTheDocument();
    });

    // Toggle to Employer
    fireEvent.click(screen.getByText("For Employers"));

    FEATURES_CONTENT.employer.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.detail)).toBeInTheDocument();
    });

    // Toggle back to Talent
    fireEvent.click(screen.getByText("For Candidates"));
    expect(screen.getByText(FEATURES_CONTENT.talent.items[0].title)).toBeInTheDocument();
  });
});
