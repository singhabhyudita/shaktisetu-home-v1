import React from "react";
import { render, screen } from "@testing-library/react";
import Clients from "../Clients";

describe("Clients", () => {
  it("renders correctly", () => {
    render(<Clients />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
