import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;

// Register
export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
}

// Login
export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
}

// Logout
export async function logout() {
  const response = await api.get("/api/auth/logout");

  return response.data;
}

// Get Logged In User
export async function getme() {
  const response = await api.get("/api/auth/get-me");

  return response.data;
}