import React from "react";
import { render, screen } from "@testing-library/react";
import CTA from "../CTA";

describe("CTA", () => {
  it("renders correctly", () => {
    render(<CTA />);
    expect(screen.getByText("Ready to get started?")).toBeInTheDocument();
    expect(screen.getByText("App Store")).toBeInTheDocument();
    expect(screen.getByText("Google Play")).toBeInTheDocument();
  });
});
