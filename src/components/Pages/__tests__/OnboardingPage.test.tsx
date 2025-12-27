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
    sessionStorage.clear();
    process.env.REACT_APP_ACCESS_CODE = "TEST_CODE";
  });

  it("renders invitation code step initially", () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText("Invitation Code")).toBeInTheDocument();
  });

  it("shows error for invalid code", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Invitation Code");
    fireEvent.change(input, { target: { value: "WRONG" } });
    fireEvent.click(screen.getByText("Verify & Continue"));
    expect(screen.getByText(/Invalid access code/)).toBeInTheDocument();
  });

  it("proceeds to form on valid code", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Invitation Code");
    fireEvent.change(input, { target: { value: "TEST_CODE" } });
    fireEvent.click(screen.getByText("Verify & Continue"));
    expect(screen.getByText("Organization Onboarding")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    mockSubmitOnboarding.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Skip to Step 2
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));

    // Fill Section 1
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
    fireEvent.change(screen.getByPlaceholderText("e.g. 19.1136, 72.8697"), {
      target: { value: "0,0" },
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

    // Skip to Step 2
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));

    // Submit (form is valid enough for mock)
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
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));

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
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));

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

  it("restores registration step from sessionStorage", () => {
    sessionStorage.setItem("lastVerifiedCode", "TEST_CODE");
    sessionStorage.setItem("verificationTime", Date.now().toString());

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Organization Onboarding")).toBeInTheDocument();
  });

  it("handles enter key on invitation code", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Invitation Code");
    fireEvent.change(input, { target: { value: "TEST_CODE" } });
    fireEvent.keyPress(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
      keyCode: 13,
    });
    await waitFor(() => {
      expect(screen.getByText("Organization Onboarding")).toBeInTheDocument();
    });
  });

  it("handles unexpected errors in submission", async () => {
    (onboardingService.submitOnboarding as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });
  });

  it("toggles section 1 by clicking header", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));

    // Switch to section 2 first
    fireEvent.click(screen.getByText("Organization Details"));
    expect(screen.getByText("01").closest(".form-section")).not.toHaveClass(
      "active",
    );

    // Switch back to section 1
    await waitFor(() => {
      fireEvent.click(screen.getByText("Organization Admin User"));
    });
    expect(screen.getByText("01").closest(".form-section")).toHaveClass(
      "active",
    );
  });

  it("handles file selection for logo and offer letter", () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText("Invitation Code"), {
      target: { value: "TEST_CODE" },
    });
    fireEvent.click(screen.getByText("Verify & Continue"));
    fireEvent.click(screen.getByText("Organization Details"));

    const logoFile = new File(["test"], "logo.png", { type: "image/png" });
    const pdfFile = new File(["test"], "template.pdf", {
      type: "application/pdf",
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fireEvent.change(fileInputs[0], { target: { files: [logoFile] } });
    fireEvent.change(fileInputs[1], { target: { files: [pdfFile] } });

    expect(screen.getByText("logo.png")).toBeInTheDocument();
    expect(screen.getByText("template.pdf")).toBeInTheDocument();
  });
});
