import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';  // <-- ✨ Important!
import App from "./App";

// Helper
function renderWithRouter(route = "/") {
  return render(
    <App router={({ children }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>} />
  );
}

describe("App Routing", () => {

  test("renders home page by default", () => {
    renderWithRouter("/");
    expect(screen.getAllByText(/pickup soccer/i)[0]).toBeInTheDocument(); 
  });

  test("renders login page", () => {
    renderWithRouter("/login");
    expect(screen.getByText(/login/i)).toBeInTheDocument(); 
  });

  test("renders signup page", () => {
    renderWithRouter("/signup");
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  test("renders games list page", () => {
    renderWithRouter("/games");
    expect(screen.getAllByText(/games/i)[0]).toBeInTheDocument();
  });



});
