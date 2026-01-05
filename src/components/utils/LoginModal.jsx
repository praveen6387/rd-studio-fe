"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { userLogin, userSignup } from "@/lib/api/client/auth/urls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState(1); // 1: choose role, 2: form
  const initialForm = {
    email: "",
    password: "",
    confirm_password: "",
    studio_name: "",
    lab_name: "",
    phone: "",
    first_name: "",
    last_name: "",
    role: "", // 1 studio, 2 lab
    gender: "",
    date_of_birth: "",
  };
  const [formData, setFormData] = useState({
    ...initialForm,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const response = await userLogin({
          phone: formData.phone,
          password: formData.password,
        });

        onLogin(response);
        onClose();
      } else {
        // signup
        const payload = {
          email: formData.email,
          password: formData.password,
          ...(String(formData.role) === "1"
            ? { organization_name: formData.studio_name }
            : String(formData.role) === "2"
            ? { organization_name: formData.lab_name }
            : {}),
          phone: formData.phone,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: Number(formData.role),
          date_of_birth: formData.date_of_birth,
          ...(formData.gender !== "" ? { gender: Number(formData.gender) } : {}),
        };
        const res = await userSignup(payload);
        // If API returns tokens, store them and log the user in; else switch to login mode
        if (res?.access) {
          Cookies.set("access_token", res.access, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
        if (res?.refresh) {
          Cookies.set("refresh_token", res.refresh, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
        if (res?.access || res?.user) {
          onLogin(res);
          onClose();
        } else {
          setMode("login");
        }
      }
    } catch (err) {
      const error_message = JSON.parse(err.message);
      setError(
        error_message?.error ||
          (mode === "login" ? "Login failed. Please try again." : "Signup failed. Please try again.")
      );
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

  const passwordsMatch =
    mode !== "signup" || signupStep !== 2
      ? true
      : formData.password.length === 0 && formData.confirm_password.length === 0
      ? true
      : formData.password === formData.confirm_password;
  const isPhoneValid =
    mode !== "signup" || signupStep !== 2 ? true : /^\d{10}$/.test((formData.phone || "").replace(/\D/g, ""));
  const isSignupFormComplete =
    mode !== "signup" || signupStep !== 2
      ? true
      : Boolean(
          formData.first_name &&
            formData.last_name &&
            (String(formData.role) === "2" ? formData.lab_name : formData.studio_name) &&
            formData.email &&
            formData.phone &&
            formData.date_of_birth &&
            formData.password &&
            formData.confirm_password
        );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] flex justify-center z-50 items-center py-6">
      <div
        className={`rounded-2xl shadow-2xl w-full mx-4 max-w-5xl bg-white ${
          mode === "login" ? "overflow-y-hidden" : "overflow-y-auto max-h-[90vh]"
        }`}
      >
        <div className="relative grid md:grid-cols-2 bg-gradient-to-br from-white via-white to-sky-200/30 overflow-hidden">
          {/* Decorative bottom-right cropped circle */}
          <div
            className="hidden md:block z-0 overflow-hidden pointer-events-none absolute -bottom-28 -right-28 h-[220px] w-[220px] rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
            style={{
              background:
                "radial-gradient(55% 55% at 35% 35%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.14) 35%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #36b6ff 0%, #0f6fe0 60%, #0a58c9 100%)",
            }}
          />
          {/* Left welcome panel */}
          <div className="relative hidden md:block min-h-[440px]  overflow-y-hidden">
            {/* <div className="absolute inset-0 bg-linear-to-b from-sky-400 via-sky-500 to-blue-700" /> */}
            {/* decorative circles (match reference) */}
            {/* Big cropped circle on the right */}
            <div
              className="absolute right-11 -top-20 h-[540px] w-[540px] rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "radial-gradient(50% 50% at 35% 35%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.04) 48%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #0b5ccc 0%, #1172e0 60%, #39b4ff 100%)",
              }}
            />
            {/* 39b4ff 1172e0 0b5ccc */}
            {/* Bottom-left large circle */}
            <div
              className="absolute -left-20 top-74 h-[300px] aspect-square rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "radial-gradient(60% 60% at 35% 35%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.12) 35%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #3cc1ff 0%, #1480ef 60%, #0b62d1 100%)",
              }}
            />
            {/* Floating middle-small circle */}
            <div
              className="absolute right-4 bottom-10 h-[150px] aspect-square rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
              style={{
                background:
                  "radial-gradient(55% 55% at 35% 35%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.14) 35%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #36b6ff 0%, #0f6fe0 60%, #0a58c9 100%)",
              }}
            />
            {/* Subtle white notch between circles */}
            {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-40 bg-white/95 rounded-t-[40px]" /> */}
            <div className="relative z-10 px-8 pt-20 text-white antialiased">
              <h3 className="text-4xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                {mode === "login" ? "WELCOME BACK" : "WELCOME"}
              </h3>
              <p className="my-3 text-lg md:text-xl font-semibold leading-7 max-w-md text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                {mode === "login"
                  ? "Your flipbooks are waiting. Let’s continue creating something beautiful."
                  : "Create your account to get started. Create, brand, and share digital flipbooks instantly. One tap access. No app needed."}
              </p>
            </div>
          </div>

          {/* Right side: form area */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{mode === "login" ? "Sign in" : "Create Account"}</h2>
              <button onClick={onClose} aria-label="Close" className="ml-3 text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {mode === "login" ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[40vh] overflow-y-hidden">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
                  )}

                  {/* Phone number */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M15.854 14.146a.5.5 0 0 1 .58-.093l3 1.5a.5.5 0 0 1 .277.447V18a3 3 0 0 1-3 3h-.5A11.5 11.5 0 0 1 4 9.5V9a3 3 0 0 1 3-3h1.999a.5.5 0 0 1 .496.438l.5 3a.5.5 0 0 1-.252.507l-1.732 1a.5.5 0 0 0-.232.588 8.003 8.003 0 0 0 4.69 4.69.5.5 0 0 0 .588-.232l1-1.732z" />
                      </svg>
                    </div>
                    <input
                      id="phone_number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                      className="h-12 w-full z-50 rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 pl-10 pr-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-300 focus:bg-white"
                    />
                  </div>

                  {/* Password with SHOW */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M17 8V7a5 5 0 1 0-10 0v1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2zm-8-1a3 3 0 1 1 6 0v1H9V7z" />
                      </svg>
                    </div>
                    <input
                      id="login_password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 pl-10 pr-16 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-300 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 my-auto text-sm font-semibold text-sky-700 hover:text-sky-800"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-blue-800 text-white font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>

                  <div className="text-center text-sm text-gray-700">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError("");
                        setSignupStep(1);
                        setFormData({ ...initialForm });
                        setShowPassword(false);
                        setShowConfirmPassword(false);
                      }}
                      className="text-sky-700 hover:underline"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {signupStep === 1 ? (
                  <div className="pr-2 md:pr-4 space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
                    )}
                    <div className="grid space-y-4 max-w-2xl">
                      <p className="text-gray-700">Sign up as:</p>

                      <button
                        type="button"
                        className="text-left rounded-xl border p-5 hover:bg-gray-100 transition shadow-sm border-gray-900 ring-2 ring-gray-900/10"
                        onClick={() => {
                          setFormData({ ...initialForm, role: "1" });
                          setSignupStep(2);
                        }}
                        aria-pressed={formData.role === "1"}
                      >
                        <div className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                          <div>Studio</div>
                          <div className="text-xs text-gray-500">Free trial</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Create your own flipbooks. Studio name appears on QR & viewer.
                        </p>
                      </button>
                      <button
                        disabled={true}
                        aria-disabled={true}
                        type="button"
                        className={`text-left rounded-xl border p-5 hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
                          formData.role === "2" ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-300"
                        }`}
                        onClick={() => {
                          setFormData({ ...initialForm, role: "2" });
                          setSignupStep(2);
                        }}
                        aria-pressed={formData.role === "2"}
                      >
                        <div className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                          <div>Lab/Designer</div>
                          <div className="text-xs text-gray-500">Coming soon</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Create flipbooks for multiple studios; set Studio Name per flipbook.
                        </p>
                      </button>
                    </div>
                    <div className="text-center text-sm text-gray-700">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                          setSignupStep(1);
                          setFormData({ ...initialForm });
                          setShowPassword(false);
                          setShowConfirmPassword(false);
                        }}
                        className="text-sky-700 hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-500">
                        {formData.role === "1" ? "Role: Studio" : formData.role === "2" ? "Role: Lab" : ""}
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      {formData.role === "1" ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm">
                          Studio account: You can create your own flipbooks. Your Studio Name will be visible on the QR
                          code and the flipbook viewer. Enjoy a 7-day free trial.
                        </div>
                      ) : formData.role === "2" ? (
                        <div className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 px-4 py-3 text-sm">
                          Lab account: Create flipbooks for multiple studio users. For each flipbook, you can set which
                          Studio Name appears on the QR code and viewer.
                        </div>
                      ) : null}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-5">
                        <Input
                          id="first_name"
                          label="First Name"
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="First name"
                          required
                          className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                        />
                        <Input
                          id="last_name"
                          label="Last Name"
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Last name"
                          required
                          className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                        />
                        <div className="">
                          <Input
                            id="org_name"
                            label={String(formData.role) === "2" ? "Lab Name" : "Studio Name"}
                            type="text"
                            name={String(formData.role) === "2" ? "lab_name" : "studio_name"}
                            value={String(formData.role) === "2" ? formData.lab_name : formData.studio_name}
                            onChange={handleChange}
                            placeholder={String(formData.role) === "2" ? "Enter lab name" : "Enter studio name"}
                            required
                            className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                          />
                          {/* <p className="mt-1 text-xs text-gray-500">
                            {String(formData.role) === "2"
                              ? "You can set a different Studio Name per flipbook."
                              : "Appears on QR code & flipbook viewer."}
                          </p> */}
                        </div>
                        <Input
                          id="signup_email"
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                        />
                        <div>
                          <Input
                            id="phone"
                            label="Phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            pattern="^[0-9]{10}$"
                            className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                          />
                          {formData.phone && !isPhoneValid && (
                            <p className="text-xs text-red-600 md:col-span-2 mt-1">Phone must be 10 digits.</p>
                          )}
                        </div>
                        <Input
                          id="dob"
                          label="Date of Birth"
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          required
                          className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                        />
                        {/* Gender field removed per requirements */}
                        <div className="flex flex-col gap-y-2">
                          <Label htmlFor="signup_password">Password</Label>
                          <div className="relative">
                            <input
                              id="signup_password"
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="h-12 w-full rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-500 pr-10 pl-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                              placeholder="Enter a strong password"
                              required
                            />
                            <button
                              type="button"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <Label htmlFor="signup_confirm_password">Confirm Password</Label>
                          <div className="relative">
                            <input
                              id="signup_confirm_password"
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirm_password"
                              value={formData.confirm_password}
                              onChange={handleChange}
                              className={`h-12 w-full rounded-xl pr-10 pl-3 border ${
                                passwordsMatch
                                  ? "bg-gray-100 text-gray-900 placeholder:text-gray-500 border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white"
                                  : "border-red-400 bg-gray-100 text-gray-900"
                              }`}
                              placeholder="Re-enter password"
                              required
                            />
                            <button
                              type="button"
                              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {!passwordsMatch && (
                            <p className="mt-1 text-sm text-red-600" aria-live="polite">
                              Passwords do not match.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading || !passwordsMatch || !isSignupFormComplete || !isPhoneValid}
                          className="w-full h-12 rounded-xl bg-blue-800 text-white font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Creating account..." : "Create account"}
                        </button>
                      </div>
                    </form>
                    <div className="text-center text-sm text-gray-700 mt-3">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                          setSignupStep(1);
                          setFormData({ ...initialForm });
                          setShowPassword(false);
                          setShowConfirmPassword(false);
                        }}
                        className="text-sky-700 hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
