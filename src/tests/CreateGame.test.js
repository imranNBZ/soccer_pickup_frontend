import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import CreateGame from "../pages/CreateGame";

// Mock MapView since it uses Mapbox (to avoid TextDecoder issues)
jest.mock("../components/MapView", () => () => <div>Mocked MapView</div>);

describe("CreateGame Page", () => {

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => "fake-token");
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders create game form", () => {
    render(
      <MemoryRouter>
        <CreateGame />
      </MemoryRouter>
    );

    expect(screen.getByText(/create a pickup game/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/game title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create game/i })).toBeInTheDocument();
  });

  test("submits form successfully", async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "✅ Game created!" }),
    });

    render(
      <MemoryRouter>
        <CreateGame />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/game title/i), {
        target: { value: "Soccer Test" },
      });
      
      fireEvent.change(screen.getByPlaceholderText(/location/i), {
        target: { value: "New York" },
      });
      
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Beginner" },
      });
      
      // ⬇️ Fix datetime input (pick second textbox input)
      fireEvent.change(screen.getAllByRole("textbox")[1], {
        target: { value: "2025-05-01T10:00" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: /create game/i }));
      

    // Check fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/games",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer fake-token`,
        }),
      })
    );
  });

});
