import { jwtDecode, JwtPayload } from "jwt-decode";


const LOGIN_LS_TOKEN = "user-token";


interface DecodedToken extends JwtPayload {
  _id: string;
  role: "admin" | "user";
  email?: string;
  username?: string;
  name?: string;
}

export const loginUser = (token: string) => {
  localStorage.setItem(LOGIN_LS_TOKEN, token);
  window.location.reload();
};


export const logoutUser = () => {
  localStorage.removeItem(LOGIN_LS_TOKEN);
  window.location.reload();
};


export const getAuthenticatedUser = (): DecodedToken | null => {
  const token = localStorage.getItem(LOGIN_LS_TOKEN);

  if (!token || typeof token !== "string" || token.trim() === "") {
   
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