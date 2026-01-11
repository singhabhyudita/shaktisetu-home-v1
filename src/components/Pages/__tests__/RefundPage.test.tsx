import React from "react";
import { render, screen } from "@testing-library/react";
import RefundPage from "../RefundPage";
import { REFUND_CONTENT } from "../../../data/siteContent";

jest.mock("../../../data/siteContent", () => ({
  ...jest.requireActual("../../../data/siteContent"),
  REFUND_CONTENT: [
    "Refund Policy",
    "Brief content about the one-time placement fee and refund terms.",
  ],
}));

describe("RefundPage", () => {
  it("renders correctly without sections", () => {
    render(<RefundPage />);
    expect(screen.getByText(REFUND_CONTENT[0])).toBeInTheDocument();
    expect(screen.getByText(REFUND_CONTENT[1])).toBeInTheDocument();

    // Verify sections are NOT present
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    expect(screen.getByText(/Support & Grievances/)).toBeInTheDocument();
  });
});
