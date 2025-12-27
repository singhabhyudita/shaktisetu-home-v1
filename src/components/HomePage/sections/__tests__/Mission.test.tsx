import React from "react";
import { render, screen } from "@testing-library/react";
import Mission from "../Mission";
import { MISSION_CONTENT } from "../../../../data/siteContent";

describe("Mission", () => {
  it("renders correctly", () => {
    render(<Mission />);
    expect(screen.getByText(MISSION_CONTENT.title)).toBeInTheDocument();
    expect(screen.getByText(MISSION_CONTENT.text)).toBeInTheDocument();
  });
});
