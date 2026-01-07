import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "../PrivacyPage";
import { PRIVACY_CONTENT } from "../../../data/siteContent";

jest.mock("../../../data/siteContent", () => ({
  ...jest.requireActual("../../../data/siteContent"),
  PRIVACY_CONTENT: [
    "Privacy Policy",
    "Intro",
    "1. DATA COLLECTION",
    "", // Blank line to cover branch
    "We collect basic profile data (name, phone) and identity details (PAN) strictly for industrial verification.",
    "2. DATA USAGE",
    "Content for usage."
  ]
}));

describe("PrivacyPage", () => {
  it("renders correctly with sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByText(PRIVACY_CONTENT[0])).toBeInTheDocument();

    // Verify specific sections are parsed
    expect(screen.getByText("1. DATA COLLECTION")).toBeInTheDocument();
    expect(screen.getByText("2. DATA USAGE")).toBeInTheDocument();

    // Verify navigation links
    expect(screen.getByText("DATA COLLECTION")).toBeInTheDocument();
    expect(screen.getByText("DATA USAGE")).toBeInTheDocument();

    expect(screen.getByText(/Grievance Officer/)).toBeInTheDocument();
  });

  it("handles empty policy content gracefully", () => {
    const {
      PRIVACY_CONTENT: mock,
    } = require("../../../data/siteContent");

    // Briefly override mock for this test
    const original = [...mock];
    mock.splice(0, mock.length, "Empty Title", "Empty Intro");

    render(<PrivacyPage />);
    expect(screen.getByText("Empty Title")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();

    // Restore
    mock.splice(0, mock.length, ...original);
  });
});
