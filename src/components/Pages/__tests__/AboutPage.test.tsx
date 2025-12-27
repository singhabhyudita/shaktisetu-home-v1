import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPage from "../AboutPage";

describe("AboutPage", () => {
  it("renders correctly", () => {
    render(<AboutPage />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText(/ShaktiSetu was born from a simple 'Aha!' moment/),
    ).toBeInTheDocument();
  });
});
