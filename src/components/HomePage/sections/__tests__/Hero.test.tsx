import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "../Hero";
import { HERO_CONTENT } from "../../../../data/siteContent";

describe("Hero", () => {
  it("renders correctly", () => {
    render(<Hero />);
    expect(screen.getByText(HERO_CONTENT.title)).toBeInTheDocument();
    expect(
      screen.getByText(/Connecting tech-enabled talent/),
    ).toBeInTheDocument();
  });
});
