"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { userLogin, userSignup } from "@/lib/api/client/auth/urls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
          gender: Number(formData.gender),
          date_of_birth: formData.date_of_birth,
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
            formData.gender !== "" &&
            formData.date_of_birth &&
            formData.password &&
            formData.confirm_password
        );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl max-w-lg md:max-w-2xl w-full mx-4">
        <div className="flex items-start justify-between mb-6">
          <div className="w-full">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setSignupStep(1);
                  setError("");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === "login" ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setSignupStep(1);
                  setFormData({ ...initialForm }); // make signup form empty initially
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === "signup" ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="ml-3 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === "login" ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
              )}

              <Input
                id="phone_number"
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone number"
                required
                className="bg-gray-50 border-gray-200 focus:bg-white"
              />

              <Input
                id="login_password"
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="bg-gray-50 border-gray-200 focus:bg-white"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            {signupStep === 1 ? (
              <div className="pr-2 md:pr-4 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
                )}
                <p className="text-gray-700">Sign up as:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <button
                    type="button"
                    className={`text-left rounded-xl border p-5 hover:bg-gray-100 transition shadow-sm ${
                      formData.role === "1" ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-300"
                    }`}
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
                    type="button"
                    className={`text-left rounded-xl border p-5 hover:bg-gray-50 transition shadow-sm ${
                      formData.role === "2" ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-300"
                    }`}
                    onClick={() => {
                      setFormData({ ...initialForm, role: "2" });
                      setSignupStep(2);
                    }}
                    aria-pressed={formData.role === "2"}
                  >
                    <div className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      <div>Studio</div>
                      <div className="text-xs text-gray-500">Coming soon</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Create flipbooks for multiple studios; set Studio Name per flipbook.
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex items-center justify-between mb-2">
                  {/* <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    ← Back to user type
                  </button> */}
                  <div className="text-xs text-gray-500">
                    {formData.role === "1" ? "Role: Studio" : formData.role === "2" ? "Role: Lab" : ""}
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
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
                    />
                    <div className="md:col-span-2">
                      <Input
                        id="org_name"
                        label={String(formData.role) === "2" ? "Lab Name" : "Studio Name"}
                        type="text"
                        name={String(formData.role) === "2" ? "lab_name" : "studio_name"}
                        value={String(formData.role) === "2" ? formData.lab_name : formData.studio_name}
                        onChange={handleChange}
                        placeholder={String(formData.role) === "2" ? "Enter lab name" : "Enter studio name"}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {String(formData.role) === "2"
                          ? "You can set a different Studio Name per flipbook."
                          : "This name appears on the QR code and flipbook viewer."}
                      </p>
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
                    />
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(val) => setFormData({ ...formData, gender: val })}
                        required
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Male</SelectItem>
                          <SelectItem value="1">Female</SelectItem>
                          <SelectItem value="2">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="signup_password">Password</Label>
                      <div className="relative">
                        <input
                          id="signup_password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent pr-10 pl-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 text-black"
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
                          className={`flex h-9 w-full rounded-md bg-transparent pr-10 pl-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 text-black ${
                            passwordsMatch ? "border border-input" : "border border-red-400"
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
                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !passwordsMatch || !isSignupFormComplete || !isPhoneValid}
                      className="bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
