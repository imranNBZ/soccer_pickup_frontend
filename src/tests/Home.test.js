import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";
import "@testing-library/jest-dom"; 

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Home Page", () => {
    test("shows login prompt when not logged in", () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
  
      expect(screen.getByText(/please/i)).toBeInTheDocument();
      expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });
  test("shows RSVP'd games when logged in", async () => {
    localStorage.setItem("token", "fakeToken");
    localStorage.setItem("userId", "1");

    global.fetch = jest.fn((url) => {
      if (url.includes("/rsvps")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              title: "Test Game",
              datetime: "2025-05-01T10:00",
              location: "New York",
              skill_level: "Intermediate"
            }
          ]),
        });
      }
      return Promise.reject(new Error("Unhandled fetch: " + url));
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(await screen.findByText(/your rsvp’d games/i)).toBeInTheDocument();
    expect(await screen.findByText(/test game/i)).toBeInTheDocument();
    expect(await screen.findByText(/new york/i)).toBeInTheDocument();
  });

  test("shows info alert when logged in but no games", async () => {
    localStorage.setItem("token", "fakeToken");
    localStorage.setItem("userId", "1");

    global.fetch = jest.fn((url) => {
      if (url.includes("/rsvps")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error("Unhandled fetch: " + url));
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(await screen.findByText(/you haven’t joined any games yet/i)).toBeInTheDocument();
  });

  test("shows flash message on fetch error", async () => {
    localStorage.setItem("token", "fakeToken");
    localStorage.setItem("userId", "1");

    global.fetch = jest.fn((url) => {
      if (url.includes("/rsvps")) {
        return Promise.resolve({
          ok: false,
        });
      }
      return Promise.reject(new Error("Unhandled fetch: " + url));
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(await screen.findByText(/⚠️ failed to load your games/i)).toBeInTheDocument();
  });
});
