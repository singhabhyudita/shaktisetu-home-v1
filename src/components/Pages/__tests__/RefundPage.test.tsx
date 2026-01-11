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
  it("renders correctly without sections (brief content)", () => {
    render(<RefundPage />);
    expect(screen.getByText(REFUND_CONTENT[0])).toBeInTheDocument();
    expect(screen.getByText(REFUND_CONTENT[1])).toBeInTheDocument();

    // Verify sections are NOT present
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    expect(screen.getByText(/Support & Grievances/)).toBeInTheDocument();
  });

  it("renders correctly with sections (legacy/complex content)", () => {
    const { REFUND_CONTENT: mock } = require("../../../data/siteContent");
    const original = [...mock];

    // Manually inject sections into the mock
    mock.splice(
      0,
      mock.length,
      "Refund Policy",
      "Intro",
      "1. SECTION ONE",
      "Content One",
      "", // Blank line to cover line.match branch
      "2. SECTION TWO",
      "Content Two",
    );

    render(<RefundPage />);

    // Verify navigation links
    expect(screen.getByText("SECTION ONE")).toBeInTheDocument();
    expect(screen.getByText("SECTION TWO")).toBeInTheDocument();

    // Verify sections
    expect(screen.getByText("1. SECTION ONE")).toBeInTheDocument();
    expect(screen.getByText("Content One")).toBeInTheDocument();
    expect(screen.getByText("2. SECTION TWO")).toBeInTheDocument();
    expect(screen.getByText("Content Two")).toBeInTheDocument();

    // Restore original mock
    mock.splice(0, mock.length, ...original);
  });
});
