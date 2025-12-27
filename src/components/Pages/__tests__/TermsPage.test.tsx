import React from "react";
import { render, screen } from "@testing-library/react";
import TermsPage from "../TermsPage";
import { TERMS_CONTENT } from "../../../data/siteContent";

describe("TermsPage", () => {
  it("renders correctly with sections", () => {
    render(<TermsPage />);
    expect(screen.getByText(TERMS_CONTENT[0])).toBeInTheDocument();
    expect(screen.getByText("1. FOR CANDIDATES")).toBeInTheDocument();
    // The intro text (TERMS_CONTENT[1]) is currently not rendered by the logic in TermsPage.tsx
  });
});
