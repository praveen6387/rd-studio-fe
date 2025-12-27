"use client";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Function to decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      setIsChecking(true);

      // If not logged in, redirect to home
      if (!user) {
        router.push("/");
        return;
      }

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        router.push("/");
        return;
      }

      // Decode the token
      const tokenPayload = decodeJWT(accessToken);

      if (!tokenPayload) {
        router.push("/");
        return;
      }

      // Check if token is expired
      if (tokenPayload.exp && Date.now() >= tokenPayload.exp * 1000) {
        router.push("/");
        return;
      }

      // If requireAdmin is true, check is_admin field
      if ((requireAdmin && (tokenPayload.role || 0)) < 1) {
        router.push("/");
        return;
      }

      // User is authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    if (!loading) {
      checkAuthorization();
    }
  }, [user, loading, router, requireAdmin]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  // User is logged in and authorized
  return children;
}
