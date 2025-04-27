import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../pages/Signup";

// Mock navigate()
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate
}));

beforeEach(() => {
  jest.useFakeTimers(); // 🕰️ for flash message auto-close
  jest.clearAllMocks();
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("Signup Page", () => {
  test("renders signup form fields", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/short bio/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/profile picture url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("successful signup shows success flash and redirects", async () => {
    // Mock successful signup
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" }
    });
    fireEvent.change(screen.getByPlaceholderText(/short bio/i), {
      target: { value: "Just a test user" }
    });
    fireEvent.change(screen.getByPlaceholderText(/location/i), {
      target: { value: "New York" }
    });
    fireEvent.change(screen.getByPlaceholderText(/profile picture url/i), {
      target: { value: "https://example.com/pic.jpg" }
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Expect success flash
    expect(await screen.findByText(/user created/i)).toBeInTheDocument();

    // Advance timers by 1500ms for redirect
    jest.advanceTimersByTime(1500);
     

    // Wait for redirect to happen
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/login");
    });
    
    jest.useRealTimers();
  });

  test("failed signup shows error flash", async () => {
    // Mock failed signup
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already taken" })
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "existinguser" }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "taken@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/email already taken/i)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
