import React from "react";
import { render, screen } from "@testing-library/react";
import PageHeader from "../PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "text-gradient",
    );
  });
});
