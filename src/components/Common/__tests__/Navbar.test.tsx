import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    window.scrollY = 0;
    jest.clearAllMocks();
  });

  it("renders logo and nav links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByText("ShaktiSetu")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("toggles menu on hamburger click", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    const hamburger = screen.getByRole("button");
    fireEvent.click(hamburger); // Open
    expect(document.querySelector("nav")).toHaveClass("menu-open");
    fireEvent.click(hamburger); // Close
    expect(document.querySelector("nav")).not.toHaveClass("menu-open");
  });

  it("changes style on scroll", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(document.querySelector("nav")).toHaveClass("scrolled");
  });

  it("handles anchor clicks on home page", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const featuresLink = screen.getByText("Features");
    const scrollIntoViewSpy = jest.fn();
    const querySelectorSpy = jest
      .spyOn(document, "querySelector")
      .mockImplementation((selector) => {
        if (selector === "#features") {
          return { scrollIntoView: scrollIntoViewSpy } as any;
        }
        return null;
      });

    fireEvent.click(featuresLink);
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: "smooth" });
    querySelectorSpy.mockRestore();
  });

  it("uses Links instead of anchor tags when not on home page", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Navbar />
      </MemoryRouter>,
    );

    const featuresLink = screen.getByText("Features");
    expect(featuresLink.getAttribute("href")).toBe("/#features");
  });

  it("closes menu when logo is clicked", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button")); // Open
    fireEvent.click(screen.getByText("ShaktiSetu").closest("a")!);
    await waitFor(() => {
      expect(screen.getByRole("navigation")).not.toHaveClass("menu-open");
    });
  });

  it("closes menu when About link is clicked", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button")); // Open
    fireEvent.click(screen.getByText("About").closest("a")!);
    await waitFor(() => {
      expect(screen.getByRole("navigation")).not.toHaveClass("menu-open");
    });
  });

  it("closes menu when Features link is clicked on non-home page", async () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Navbar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button")); // Open
    fireEvent.click(screen.getByText("Features").closest("a")!);
    await waitFor(() => {
      expect(screen.getByRole("navigation")).not.toHaveClass("menu-open");
    });
  });

  it("handles Get the App click on both home and non-home pages", async () => {
    // Non-home page
    const { rerender } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <Navbar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button")); // Open
    fireEvent.click(screen.getByText("Get the App").closest("a")!);
    await waitFor(() => {
      expect(screen.getByRole("navigation")).not.toHaveClass("menu-open");
    });

    // Home page
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );
    const scrollIntoViewSpy = jest.fn();
    jest.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView: scrollIntoViewSpy,
    } as any);

    fireEvent.click(screen.getByText("Get the App"));
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });
});
