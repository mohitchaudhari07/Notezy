/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

const AuthContext = createContext(null);

function getStoredUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);
  if (!token || !storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.login(credentials);
        if (!data.token || !data.user) {
          throw new Error("Login response did not include a session token.");
        }
        persistSession(data.token, data.user);
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.register(userData);
        if (!data.token || !data.user) {
          throw new Error("Registration response did not include a session token.");
        }
        persistSession(data.token, data.user);
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      clearError,
      setUser,
    }),
    [user, loading, error, login, register, logout, clearError]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
