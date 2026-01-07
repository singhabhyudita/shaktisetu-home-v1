import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingPage from "../OnboardingPage";
import { onboardingService } from "../../../services/onboardingService";

// Mock service
jest.mock("../../../services/onboardingService");

describe("OnboardingPage", () => {
  const mockSubmitOnboarding = onboardingService.submitOnboarding as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the onboarding form initially", () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Organization Onboarding")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your invitation code"),
    ).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    mockSubmitOnboarding.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Fill Section 1
    fireEvent.change(
      screen.getByPlaceholderText("Enter your invitation code"),
      {
        target: { value: "TEST_CODE" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Admin User" },
    });
    fireEvent.change(screen.getByPlaceholderText("john@organization.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.click(screen.getByText("Next Step: Organization Details"));

    // Fill Section 2
    fireEvent.change(screen.getByPlaceholderText("e.g. McDonald's India"), {
      target: { value: "Test Org" },
    });
    fireEvent.click(screen.getByText("Next Step: Outlets & Managers"));

    // Fill Section 3
    fireEvent.change(screen.getByPlaceholderText("Andheri West Outlet"), {
      target: { value: "Outlet 1" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Street, Building, Landmark, Pincode"),
      { target: { value: "Address 1" } },
    );
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Manager 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("manager@outlet.com"), {
      target: { value: "manager@test.com" },
    });

    // Submit
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(screen.getByText("Registration Successful!")).toBeInTheDocument();
    });
  });

  it("handles submission errors", async () => {
    mockSubmitOnboarding.mockResolvedValue({
      success: false,
      error: "Registration failed",
    });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Fill minimum required fields
    fireEvent.change(
      screen.getByPlaceholderText("Enter your invitation code"),
      {
        target: { value: "TEST_CODE" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("john@organization.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. McDonald's India"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Andheri West Outlet"), {
      target: { value: "Outlet" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Street, Building, Landmark, Pincode"),
      {
        target: { value: "Addr" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Mgr" },
    });
    fireEvent.change(screen.getByPlaceholderText("manager@outlet.com"), {
      target: { value: "mgr@test.com" },
    });

    // Submit
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });

  it("allows adding and removing outlets", () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Should not have remove button with 1 outlet
    expect(screen.queryByText("Remove Outlet")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("+ Add Another Outlet"));
    expect(screen.getByText("Outlet #2")).toBeInTheDocument();

    const removeButtons = screen.getAllByText("Remove Outlet");
    expect(removeButtons.length).toBe(2);

    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText("Outlet #2")).not.toBeInTheDocument();
  });

  it("redirects to homepage from success step", async () => {
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    (window as any).location = { ...originalLocation, href: "" };

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Fill valid data
    fireEvent.change(
      screen.getByPlaceholderText("Enter your invitation code"),
      { target: { value: "CODE" } },
    );
    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("john@organization.com"), {
      target: { value: "a@a.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. McDonald's India"), {
      target: { value: "Org" },
    });
    fireEvent.change(screen.getByPlaceholderText("Andheri West Outlet"), {
      target: { value: "O1" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Street, Building, Landmark, Pincode"),
      { target: { value: "A1" } },
    );
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "M1" },
    });
    fireEvent.change(screen.getByPlaceholderText("manager@outlet.com"), {
      target: { value: "m1@a.com" },
    });

    // Success step
    (onboardingService.submitOnboarding as jest.Mock).mockResolvedValue({
      success: true,
    });
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      const btn = screen.queryByText("Return to Homepage");
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn!);
    });

    await waitFor(() => {
      expect(window.location.href).toBe("/");
    });

    (window as any).location = originalLocation;
  });

  it("validates missing fields before submission", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    expect(
      screen.getByText(
        "Please fill in all required fields highlighted in red. Ensure emails are valid.",
      ),
    ).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("john@organization.com"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    expect(
      screen.getByText(
        "Please fill in all required fields highlighted in red. Ensure emails are valid.",
      ),
    ).toBeInTheDocument();
  });

  it("converts invitation code to uppercase automatically", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText("Enter your invitation code");
    fireEvent.change(input, { target: { value: "lowercasecode" } });

    expect(input).toHaveValue("LOWERCASECODE");
  });

  it("toggles section 1 by clicking header", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Switch to section 2
    fireEvent.click(screen.getByText("Organization Details"));
    expect(screen.getByText("01").closest(".form-section")).not.toHaveClass(
      "active",
    );

    // Switch back to section 1
    fireEvent.click(screen.getByText("Invitation & Admin"));
    expect(screen.getByText("01").closest(".form-section")).toHaveClass(
      "active",
    );
  });
});
