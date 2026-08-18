import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = `${(typeof process !== "undefined" && process.env && process.env.REACT_APP_BACKEND_URL) ? process.env.REACT_APP_BACKEND_URL : "http://127.0.0.1:8001"}/api`;

// Axios instance: always send cookies
const http = axios.create({ baseURL: API, withCredentials: true });

const AuthContext = createContext(null);

const NO_AUTH =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_NO_AUTH === "1" ||
      process.env.REACT_APP_NO_AUTH === "true")) ||
  (typeof window !== "undefined" &&
    (window.localStorage.getItem("aether.noAuth") === "1" ||
      window.location.search.includes("noauth=1")));

const GUEST_USER = {
  user_id: "local-guest",
  email: "local@aether.local",
  name: "Local Operator",
  picture: null,
  role: "user",
  plan: "founding_builder",
  credits: 9999,
  provider: "local",
  member_since: new Date().toISOString(),
};
export const useAuth = () => useContext(AuthContext);

// FastAPI 422 returns {detail: [{msg,...}]} — normalize to string
export const formatApiError = (detail) => {
  if (detail == null) return "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await http.get("/auth/me");
      setUser(data);
      return data;
    } catch {
      setUser(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (NO_AUTH) {
      setUser(GUEST_USER);
      setLoading(false);
      return;
    }
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  const loginEmail = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const signupEmail = async (email, password, name) => {
    const { data } = await http.post("/auth/signup", { email, password, name });
    setUser(data);
    return data;
  };

  const loginGoogle = async (credential) => {
    const { data } = await http.post("/auth/google", { credential });
    setUser(data);
    return data;
  };

  const exchangeCloudSession = async (session_id) => {
    const { data } = await http.post("/auth/session", { session_id });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Logout request failed; clearing local state anyway.", e?.response?.status || e?.message);
      }
    }
    setUser(false);
  };

  const syncProfile = useCallback(async () => {
    try {
      const { data } = await http.get("/auth/me");
      setUser(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      noAuth: !!NO_AUTH,
      refresh,
      syncProfile,
      loginEmail,
      signupEmail,
      loginGoogle,
      exchangeCloudSession,
      logout,
      http,
    }),
    [user, loading, refresh, syncProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
