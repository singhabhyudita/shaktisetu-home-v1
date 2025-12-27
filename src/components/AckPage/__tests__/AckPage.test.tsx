import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import AckPage from "../AckPage";
import { notificationService } from "../../../services/notificationService";

// Mock services and router
jest.mock("../../../services/notificationService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

describe("AckPage", () => {
  const mockAcknowledgeNotification =
    notificationService.acknowledgeNotification as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: (key: string) => (key === "token" ? "test-token" : null) },
    ]);
  });

  it("renders loading state initially", () => {
    mockAcknowledgeNotification.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Processing")).toBeInTheDocument();
  });

  it("renders success state when token is valid", async () => {
    mockAcknowledgeNotification.mockResolvedValue({
      success: true,
      message: "Valid token",
    });
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Thank You!")).toBeInTheDocument();
      expect(screen.getByText("Valid token")).toBeInTheDocument();
    });
  });

  it("renders error state when token is invalid", async () => {
    mockAcknowledgeNotification.mockResolvedValue({
      success: false,
      error: "Invalid token",
    });
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Invalid token")).toBeInTheDocument();
    });
  });

  it("renders error state when token is missing", async () => {
    (useSearchParams as jest.Mock).mockReturnValue([{ get: () => null }]);
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText(/Missing token parameter/)).toBeInTheDocument();
    });
  });

  it("handles service success without message", async () => {
    mockAcknowledgeNotification.mockResolvedValue({ success: true });
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Notification acknowledged successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("handles service failure without error message", async () => {
    mockAcknowledgeNotification.mockResolvedValue({ success: false });
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to acknowledge token"),
      ).toBeInTheDocument();
    });
  });

  it("handles service exceptions with message", async () => {
    mockAcknowledgeNotification.mockRejectedValue(new Error("Network failure"));
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });

  it("handles service exceptions without message", async () => {
    mockAcknowledgeNotification.mockRejectedValue("Generic error");
    render(
      <MemoryRouter>
        <AckPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to acknowledge token"),
      ).toBeInTheDocument();
    });
  });
});
