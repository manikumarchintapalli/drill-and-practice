import { jwtDecode, JwtPayload } from "jwt-decode";

// JWT Token storage key
const LOGIN_LS_TOKEN = "user-token";

// Define interface for your JWT payload
interface DecodedToken extends JwtPayload {
  _id: string;
  role: "admin" | "user";
  email?: string;
  username?: string;
  name?: string;
}

// Login user by saving JWT and reloading
export const loginUser = (token: string) => {
  localStorage.setItem(LOGIN_LS_TOKEN, token);
  window.location.reload();
};

// Logout user by removing JWT and reloading
export const logoutUser = () => {
  localStorage.removeItem(LOGIN_LS_TOKEN);
  window.location.reload();
};

// Get authenticated user's decoded JWT payload
export const getAuthenticatedUser = (): DecodedToken | null => {
  const token = localStorage.getItem(LOGIN_LS_TOKEN);

  if (!token || typeof token !== "string" || token.trim() === "") {
    // No token found, don't warn unnecessarily
    return null;
  }

  try {
    if (token.split(".").length !== 3) {
      console.warn("Invalid token structure. Clearing token.");
      localStorage.removeItem(LOGIN_LS_TOKEN);
      return null;
    }

    const decoded = jwtDecode<DecodedToken>(token);

    if (!decoded.role || !decoded._id) {
      console.warn("Decoded token missing fields. Clearing token.");
      localStorage.removeItem(LOGIN_LS_TOKEN);
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    localStorage.removeItem(LOGIN_LS_TOKEN);
    return null;
  }
};

// Check if authenticated user is an admin
export const isAdmin = (): boolean => {
  const user = getAuthenticatedUser();
  return user?.role === "admin";
};

// Check if authenticated user is a regular user
export const isUser = (): boolean => {
  const user = getAuthenticatedUser();
  return user?.role === "user";
};