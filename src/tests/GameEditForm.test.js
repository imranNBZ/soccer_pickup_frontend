import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GameEditForm from "../pages/GameEditForm";
import "@testing-library/jest-dom";


// Mock mapbox-gl (important because otherwise it breaks in test environment)
jest.mock("mapbox-gl", () => ({
  Map: function () {
    return {
      on: jest.fn(),
      remove: jest.fn(),
      setCenter: jest.fn(),
    };
  },
  Marker: function () {
    return {
      setLngLat: jest.fn().mockReturnThis(),
      addTo: jest.fn(),
    };
  },
}));

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          title: "Mock Game",
          datetime: "2025-05-01T10:00:00",
          location: "New York",
          skill_level: "Beginner",
          latitude: 40.7128,
          longitude: -74.006,
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GameEditForm Page", () => {
  test("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/games/1/edit"]}>
        <Routes>
          <Route path="/games/:id/edit" element={<GameEditForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading game info/i)).toBeInTheDocument();
  });

  test("renders form after loading", async () => {
    render(
      <MemoryRouter initialEntries={["/games/1/edit"]}>
        <Routes>
          <Route path="/games/:id/edit" element={<GameEditForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait until the title field appears
    await waitFor(() => {
      expect(screen.getByDisplayValue(/mock game/i)).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("2025-05-01T10:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/new york/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/beginner/i)).toBeInTheDocument();
  });
});
