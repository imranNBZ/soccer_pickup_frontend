import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameList from "../pages/GameList";
import "@testing-library/jest-dom";

// Mock MapView because we don't need real map rendering in test
jest.mock("../components/MapView", () => () => <div>Mocked MapView</div>);

// Mock fetch globally
beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.endsWith("/games")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { 
              id: 1,
              title: "Test Game",
              datetime: "2025-05-01T10:00",
              location: "New York",
              skill_level: "Intermediate",
              username: "testuser",
              created_by: 1
            }
          ]),
        });
      }
  
      if (url.endsWith("/games/1/rsvps")) {
        // RSVP list for that game should be EMPTY
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
  
      if (url.includes("/users")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
  
      return Promise.reject(new Error("Unhandled fetch request: " + url));
    });
  });
  

// Cleanup fetch mocks
afterEach(() => {
  jest.resetAllMocks();
});

describe("GameList Page", () => {
  test("renders heading and a game", async () => {
    render(
      <MemoryRouter>
        <GameList />
      </MemoryRouter>
    );

    // Should show loading UI first
    expect(screen.getByText(/mocked mapview/i)).toBeInTheDocument();

    // Wait until games are loaded
    await waitFor(() => {
      expect(screen.getByText(/upcoming pickup games/i)).toBeInTheDocument();
      expect(screen.getByText(/test game/i)).toBeInTheDocument();
      expect(screen.getByText(/intermediate/i)).toBeInTheDocument();
    });
  });

  test("renders 'No RSVPs yet' if no players", async () => {
    render(
      <MemoryRouter>
        <GameList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no rsvps yet/i)).toBeInTheDocument();
    });
  });
});
