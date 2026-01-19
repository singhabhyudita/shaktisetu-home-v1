import React from "react";
import { render, screen } from "@testing-library/react";
import Pricing from "../Pricing";

describe("Pricing", () => {
  it("renders correctly with premium text", () => {
    render(<Pricing />);
    expect(screen.getByText("Transparent Pricing")).toBeInTheDocument();
    expect(screen.getByText("₹2,500")).toBeInTheDocument();
    expect(screen.getByText(/per candidate placed/i)).toBeInTheDocument();
  });

  it("does not contain the temporary integration note", () => {
    render(<Pricing />);
    expect(
      screen.queryByText(/Temporary pricing until payment gateway/i),
    ).not.toBeInTheDocument();
  });
});
