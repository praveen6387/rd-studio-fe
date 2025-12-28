"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Clean up old token from previous system
    localStorage.removeItem("token");

    setLoading(false);
  }, []);

  const login = (response) => {
    // Extract user data and tokens from response
    const { user: userData, access, refresh } = response;

    // Add type and name fields to user data
    const enhancedUserData = {
      ...userData,
      type: userData.role_name,
      name: `${userData.first_name} ${userData.last_name}`.trim(),
    };

    // Store user data
    setUser(enhancedUserData);
    localStorage.setItem("user", JSON.stringify(enhancedUserData));

    // Store tokens separately
    // if (access) localStorage.setItem("accessToken", access);
    // if (refresh) localStorage.setItem("refreshToken", refresh);

    Cookies.set("access_token", access, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Cookies.set("refresh_token", refresh, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token"); // Clean up old token if exists

    // Remove tokens from cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
