import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";


// Mock navigate()
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  
  global.fetch = jest.fn(); // reset fetch before every test
});

describe("Login Page", () => {
  test("renders login form fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("successful login shows success flash and redirects", async () => {
    jest.useFakeTimers();


    // Mock successful login
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "fake-token",
        user: { id: 1, username: "testuser", isAdmin: false }
      })
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Expect success flash
    expect(await screen.findByText(/successfully logged in/i)).toBeInTheDocument();
    
    jest.runAllTimers();

    // Wait for the redirect
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/games");
    });

    // Check localStorage values
    expect(localStorage.getItem("token")).toBe("fake-token");
    expect(localStorage.getItem("username")).toBe("testuser");
    expect(localStorage.getItem("userId")).toBe("1");
    expect(localStorage.getItem("isAdmin")).toBe("false");
  });

  test("failed login shows error flash", async () => {
    // Mock failed login
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Invalid credentials"
      })
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" }
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled(); 
  });
});
