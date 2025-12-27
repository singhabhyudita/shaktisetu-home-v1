import React from "react";
import { render } from "@testing-library/react";
import HomePage from "../HomePage";

// Mock child components to isolate HomePage test
jest.mock("../sections/Hero", () => () => <div data-testid="hero" />);
jest.mock("../sections/Mission", () => () => <div data-testid="mission" />);
jest.mock("../sections/Features", () => () => <div data-testid="features" />);
jest.mock("../sections/Testimonials", () => () => (
  <div data-testid="testimonials" />
));
jest.mock("../sections/CTA", () => () => <div data-testid="cta" />);
jest.mock("../sections/Clients", () => () => <div data-testid="clients" />);

describe("HomePage", () => {
  it("renders all sections", () => {
    const { getByTestId } = render(<HomePage />);
    expect(getByTestId("hero")).toBeInTheDocument();
    expect(getByTestId("mission")).toBeInTheDocument();
    expect(getByTestId("features")).toBeInTheDocument();
    expect(getByTestId("testimonials")).toBeInTheDocument();
    expect(getByTestId("cta")).toBeInTheDocument();
    expect(getByTestId("clients")).toBeInTheDocument();
  });
});
