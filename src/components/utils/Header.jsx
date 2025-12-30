"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import LoginModal from "./LoginModal";

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

export default function Header() {
  const { user, logout, login } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user?.role >= 1 || false);

  // Check if user is admin by decoding JWT token
  // useEffect(() => {
  //   const checkAdminStatus = () => {
  //     if (user) {
  //       const accessToken = localStorage.getItem("accessToken");
  //       if (accessToken) {
  //         const tokenPayload = decodeJWT(accessToken);
  //         setIsAdmin(tokenPayload?.role >= 1 || false);
  //       } else {
  //         setIsAdmin(false);
  //       }
  //     } else {
  //       setIsAdmin(false);
  //     }
  //   };

  //   checkAdminStatus();
  // }, [user]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = (userData) => {
    login(userData);
  };

  const getDashboardLink = () => {
    if (!user) return null;

    if (user.type === "customer") {
      return "/my-gallery";
    } else if (user.type === "admin" || user.type === "operation") {
      return "/my-gallery";
    }
    return null;
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">RD Studio</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:space-x-4 lg:space-x-6 xl:space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/gallery"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              {user && getDashboardLink() && (
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {user.type === "customer" ? "My Gallery" : "My Gallery"}
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 uppercase">
                        {user && user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium capitalize">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 capitalize">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.type}</p>
                      </div>

                      {/* Dashboard Links based on user type */}
                      {user.type === "customer" && (
                        <Link
                          href="/my-gallery"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Gallery
                        </Link>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </>
                      )}

                      {/* logout button */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:from-rose-400 hover:to-pink-400 transition-colors"
                >
                  Login
                </button>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 rounded-md"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <nav className="flex flex-col items-center space-y-2 px-4 py-4">
            <Link
              href="/"
              className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Dashboard Links */}
            {user && user.type === "customer" && (
              <Link
                href="/my-gallery"
                className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Gallery
              </Link>
            )}

            {user && isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/my-photos"
                  className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Gallery
                </Link>
                <Link
                  href="/dashboard/operations"
                  className="text-white/90 hover:text-white transition-colors text-lg font-semibold tracking-wide text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Photo Operations
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </>
  );
}
