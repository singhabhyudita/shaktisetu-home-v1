import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingPage from "../OnboardingPage";
import { OnboardingService } from "../../../services/onboardingService";

// Mock service
jest.mock("../../../services/onboardingService");

describe("OnboardingPage", () => {
  const mockSubmitOnboarding = OnboardingService.submitOnboarding as jest.Mock;

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
    (OnboardingService.submitOnboarding as jest.Mock).mockResolvedValue({
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

  it("handles file uploads for logo and offer letter", async () => {
    // Mock FileReader with a DIFFERENT instance for each call
    (window as any).FileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(function (this: any) {
        setTimeout(() => {
          this.result = "data:image/png;base64,mockbase64";
          if (this.onload) this.onload();
        }, 0);
      }),
      result: "",
      onload: null as any,
    }));

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Section 2: Org Details
    fireEvent.click(screen.getByText("Organization Details"));

    const logoInput = screen.getByTestId("logo-input");
    const mockLogo = new File(["logo"], "logo.jpg", { type: "image/jpeg" });
    fireEvent.change(logoInput, { target: { files: [mockLogo] } });

    const pdfInput = screen.getByTestId("pdf-input");
    const mockPdf = new File(["pdf"], "template.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(pdfInput, { target: { files: [mockPdf] } });

    await waitFor(() => {
      expect(screen.getByTestId("logo-name")).toHaveTextContent("logo.jpg");
      expect(screen.getByTestId("pdf-name")).toHaveTextContent("template.pdf");
    });
  });

  it("updates coordinates via MapPicker", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    const mapInput = screen.getByPlaceholderText("e.g. 19.1136, 72.8697");
    fireEvent.change(mapInput, { target: { value: "19.0760, 72.8777" } });

    // The component should update its internal state (lat/lng)
    // We can't see the state directly, but we can verify it doesn't crash
    // and potentially check if it's included in submission.

    mockSubmitOnboarding.mockResolvedValue({ success: true });

    // Fill other required fields
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

    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(mockSubmitOnboarding).toHaveBeenCalledWith(
        expect.objectContaining({
          outlets: [
            expect.objectContaining({
              location: expect.objectContaining({
                coordinates: { lat: 19.076, lon: 72.8777 },
              }),
            }),
          ],
        }),
        null,
        null,
      );
    });
  });

  it("handles complex outlet removal", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+ Add Another Outlet"));
    fireEvent.click(screen.getByText("+ Add Another Outlet"));

    const removeButtons = screen.getAllByText("Remove Outlet");
    expect(removeButtons.length).toBe(3);

    // Remove the second one
    fireEvent.click(removeButtons[1]);
    expect(screen.getAllByText(/Outlet #/i).length).toBe(2);
  });

  it("toggles all sections via header clicks", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    const headers = [
      "Invitation & Admin",
      "Organization Details",
      "Outlets & Managers",
    ];

    headers.forEach((header) => {
      fireEvent.click(screen.getByText(header));
      // No specific assertion needed beyond it not crashing and changing activeSection
    });
  });

  it("clears field errors when user types", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Trigger validation error
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));
    const tokenInput = screen.getByPlaceholderText(
      "Enter your invitation code",
    );
    expect(tokenInput).toHaveClass("invalid");

    // Type to clear error
    fireEvent.change(tokenInput, { target: { value: "A" } });
    expect(tokenInput).not.toHaveClass("invalid");

    // Check outlet error clearing
    const outletNameInput = screen.getByPlaceholderText("Andheri West Outlet");
    expect(outletNameInput).toHaveClass("invalid");
    fireEvent.change(outletNameInput, { target: { value: "New Outlet" } });
    expect(outletNameInput).not.toHaveClass("invalid");

    // Check admin info clearing
    const adminNameInput = screen.getByPlaceholderText("John Doe");
    expect(adminNameInput).toHaveClass("invalid");
    fireEvent.change(adminNameInput, { target: { value: "New Admin" } });
    expect(adminNameInput).not.toHaveClass("invalid");

    // Check org name clearing
    fireEvent.click(screen.getByText("Organization Details"));
    const orgNameInput = screen.getByPlaceholderText("e.g. McDonald's India");
    expect(orgNameInput).toHaveClass("invalid");
    fireEvent.change(orgNameInput, { target: { value: "New Org" } });
    expect(orgNameInput).not.toHaveClass("invalid");
  });

  it("handles technical submission errors with generic messages", async () => {
    mockSubmitOnboarding.mockImplementation(() => {
      throw new Error("non-2xx response from edge function");
    });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Fill minimum required fields
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

    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to process registration. Please check your data and try again.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("handles failed submission with specific error message", async () => {
    mockSubmitOnboarding.mockResolvedValue({
      success: false,
      error: "Invalid Token",
    });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Enter token
    fireEvent.change(
      screen.getByPlaceholderText("Enter your invitation code"),
      { target: { value: "INV-CODE" } },
    );

    // ... fill other required fields to bypass validation
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

    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(screen.getByText("Invalid Token")).toBeInTheDocument();
    });

    // Close modal to cover state change
    fireEvent.click(screen.getByText("I Understand"));
    await waitFor(() => {
      expect(screen.queryByText("Invalid Token")).not.toBeInTheDocument();
    });

    // Trigger again to test overlay click
    fireEvent.click(screen.getByText("Complete Onboarding Registration"));
    await waitFor(() => {
      expect(screen.getByText("Invalid Token")).toBeInTheDocument();
    });

    // Click overlay
    const overlay = screen
      .getByText("Invalid Token")
      .closest(".error-modal-overlay");
    if (overlay) fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByText("Invalid Token")).not.toBeInTheDocument();
    });
  });

  it("handles generic errors in submission", async () => {
    mockSubmitOnboarding.mockImplementation(() => {
      throw new Error("Generic Error");
    });

    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    // Fill minimum required fields
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

    fireEvent.click(screen.getByText("Complete Onboarding Registration"));

    await waitFor(() => {
      expect(screen.getByText("Generic Error")).toBeInTheDocument();
    });
  });

  it("validates logo file extension", async () => {
    render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
    );

    const logoInput = screen.getByLabelText(/organization logo/i);
    const invalidFile = new File(["foo"], "photo.png", { type: "image/png" });

    fireEvent.change(logoInput, { target: { files: [invalidFile] } });

    expect(
      screen.getByText("Please upload only .jpg or .jpeg files for the logo."),
    ).toBeInTheDocument();
  });
});
