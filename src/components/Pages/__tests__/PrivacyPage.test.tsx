import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "../PrivacyPage";
import { PRIVACY_CONTENT } from "../../../data/siteContent";

describe("PrivacyPage", () => {
  it("renders correctly with sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByText(PRIVACY_CONTENT[0])).toBeInTheDocument();
    expect(screen.getByText("1. DATA COLLECTION")).toBeInTheDocument();
    expect(screen.getByText(/Grievance Officer/)).toBeInTheDocument();
  });
});
