import { createContext, useEffect, useState } from "react";
import { login, logout, getme,register } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getme();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleRegister = async ({ username, email, password }) => {
  setLoading(true);

  try {
    await register({
      username,
      email,
      password,
    });

    const data = await getme();

    setUser(data.user);

    return data.user;
  } catch (error) {
    setUser(null);
    throw error;
  } finally {
    setLoading(false);
  }
};

  // Login
  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      await login({ email, password });

      const data = await getme();

      setUser(data.user);

      return data.user;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleLogout,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};