"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { userLogin } from "@/lib/api/client/auth/urls";
import Link from "next/link";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Send login request to API
      const response = await userLogin({
        email: formData.email,
        password: formData.password,
      });

      // Set tokens in cookies
      if (response.access) {
        Cookies.set("access_token", response.access, {
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      if (response.refresh) {
        Cookies.set("refresh_token", response.refresh, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      // On successful login, call onLogin with the user data
      onLogin(response);
      onClose();
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-between text-gray-600 text-sm mt-4 underline">
          <Link href="/signup" className="text-blue-600 hover:text-blue-700">
            Sign Up
          </Link>
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
            Forgot Password
          </Link>
        </div>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Demo Accounts:</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <strong>Customer:</strong> john.doe@example.com / customer123
            </p>
            <p>
              <strong>Admin:</strong> admin@rdphoto.com / admin123
            </p>
            <p>
              <strong>Photographer:</strong> photographer@rdphoto.com / photographer123
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
