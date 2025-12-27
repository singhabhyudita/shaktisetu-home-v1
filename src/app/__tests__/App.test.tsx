import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Mock child components to isolate App test
jest.mock("../../components/HomePage/HomePage", () => () => (
  <div data-testid="home-page" />
));
jest.mock("../../components/AckPage/AckPage", () => () => (
  <div data-testid="ack-page" />
));
jest.mock("../../components/Pages/AboutPage", () => () => (
  <div data-testid="about-page" />
));
jest.mock("../../components/Pages/PrivacyPage", () => () => (
  <div data-testid="privacy-page" />
));
jest.mock("../../components/Pages/TermsPage", () => () => (
  <div data-testid="terms-page" />
));
jest.mock("../../components/Pages/OnboardingPage", () => () => (
  <div data-testid="onboarding-page" />
));
jest.mock("../../components/Common/Navbar", () => () => (
  <div data-testid="navbar" />
));
jest.mock("../../components/Common/Footer", () => () => (
  <div data-testid="footer" />
));

describe("App", () => {
  it("renders navbar, footer and Home page by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("navigates to ack page", () => {
    render(
      <MemoryRouter initialEntries={["/ack"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("ack-page")).toBeInTheDocument();
  });

  it("navigates to about page", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("about-page")).toBeInTheDocument();
  });

  it("navigates to onboarding page", () => {
    render(
      <MemoryRouter initialEntries={["/onboarding"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("onboarding-page")).toBeInTheDocument();
  });
});
