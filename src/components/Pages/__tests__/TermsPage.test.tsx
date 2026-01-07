import React from "react";
import { render, screen } from "@testing-library/react";
import TermsPage from "../TermsPage";
import { TERMS_CONTENT } from "../../../data/siteContent";

jest.mock("../../../data/siteContent", () => ({
  ...jest.requireActual("../../../data/siteContent"),
  TERMS_CONTENT: [
    "Terms & Conditions",
    "Intro",
    "1. FOR CANDIDATES",
    "", // Blank line to cover branch
    "CANDIDATE CONTENT",
    "2. FOR EMPLOYERS",
    "EMPLOYER CONTENT"
  ]
}));

describe("TermsPage", () => {
  it("renders correctly with sections", () => {
    render(<TermsPage />);
    expect(screen.getByText(TERMS_CONTENT[0])).toBeInTheDocument();

    // Verify specific sections are parsed
    expect(screen.getByText("1. FOR CANDIDATES")).toBeInTheDocument();
    expect(screen.getByText("2. FOR EMPLOYERS")).toBeInTheDocument();

    // Verify navigation links
    expect(screen.getByText("FOR CANDIDATES")).toBeInTheDocument();
    expect(screen.getByText("FOR EMPLOYERS")).toBeInTheDocument();
  });

  it("handles empty terms content gracefully", () => {
    const { TERMS_CONTENT: mock } = require("../../../data/siteContent");

    // Briefly override mock for this test
    const original = [...mock];
    mock.splice(0, mock.length, "Empty Title", "Empty Intro");

    render(<TermsPage />);
    expect(screen.getByText("Empty Title")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();

    // Restore
    mock.splice(0, mock.length, ...original);
  });
});
