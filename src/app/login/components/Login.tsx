"use client";

import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
    agreeTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      /*
       * Backend se role aa raha hai:
       * ADMIN -> admin dashboard
       * USER  -> our games
       */
      const role = String(data.user?.role || "")
        .trim()
        .toUpperCase();

      console.log("Logged in user:", data.user);
      console.log("Logged in role:", role);

      if (role === "ADMIN") {
        window.location.replace("/admin/dashboard");
        return;
      }

      window.location.replace("/our-games");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        const messages = data.errors
          ? Object.values(data.errors).flat().join(", ")
          : data.message || "Failed to submit request.";

        setError(messages);
        return;
      }

      setSuccess(
        "Access request submitted! You will receive your login credentials via email once approved.",
      );

      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        agreeTerms: false,
      }));
    } catch (error) {
      console.error("Request access error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (signup: boolean) => {
    setIsSignUp(signup);
    setError(null);
    setSuccess(null);
  };

  return (
    <section className="relative h-[calc(100dvh-69px)] min-h-0 w-full overflow-hidden bg-white">
      {/* Clean White Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-white"
      />

      {/* Login Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-6 sm:px-6">
        <div
          className={`w-full overflow-hidden rounded-[28px] border-[1.5px] border-black/30 bg-[#FFFDF8] shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${
            isSignUp ? "max-w-[470px]" : "max-w-[470px]"
          }`}
        >
          <div className="px-8 py-8 sm:px-11 sm:py-10">
            {/* Heading */}
            <h1 className="mb-7 text-center font-serif text-[38px] font-normal leading-none tracking-tight text-black sm:text-[40px]">
              {isSignUp ? "Sign up" : "Log in"}
            </h1>

            <form
              onSubmit={isSignUp ? handleRequestAccess : handleLogin}
              className="flex flex-col gap-3.5"
            >
              {/* Error */}
              {error && (
                <div className="rounded-[10px] border border-red-300 bg-red-50 px-3 py-2 text-center text-[12px] leading-snug text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-[10px] border border-green-300 bg-green-50 px-3 py-2 text-center text-[12px] leading-snug text-green-700">
                  {success}
                </div>
              )}

              {!isSignUp ? (
                <>
                  {/* Username */}
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="User Name"
                    autoComplete="username"
                    required
                    className="h-[52px] w-full rounded-[12px] border border-black/35 bg-white px-4 text-[15px] text-black outline-none placeholder:text-[#77716a] transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />

                  {/* Password */}
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="h-[52px] w-full rounded-[12px] border border-black/35 bg-white px-4 text-[15px] text-black outline-none placeholder:text-[#77716a] transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between px-0.5 text-[12px] text-[#625d56]">
                    <label className="flex cursor-pointer items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-[13px] w-[13px] accent-black"
                      />

                      <span>Remember Me</span>
                    </label>

                    <Link
                      href="/"
                      className="text-[#1758d1] hover:underline"
                    >
                      Forget Password?
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    autoComplete="name"
                    required
                    className="h-[52px] w-full rounded-[12px] border border-black/35 bg-white px-4 text-[15px] text-black outline-none placeholder:text-[#77716a] transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E- mail"
                    autoComplete="email"
                    required
                    className="h-[52px] w-full rounded-[12px] border border-black/35 bg-white px-4 text-[15px] text-black outline-none placeholder:text-[#77716a] transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />

                  {/* Phone */}
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    autoComplete="tel"
                    className="h-[52px] w-full rounded-[12px] border border-black/35 bg-white px-4 text-[15px] text-black outline-none placeholder:text-[#77716a] transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-2 px-0.5 text-[12px] leading-[1.35] text-[#625d56] select-none">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="mt-[1px] h-[13px] w-[13px] shrink-0 accent-black"
                    />

                    <span>
                      I agree to the{" "}
                      <span className="font-bold text-black">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="font-bold text-black">
                        Privacy Policy
                      </span>
                    </span>
                  </label>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[44px] min-w-[175px] rounded-[12px] border-[1.5px] border-black bg-black px-8 font-serif text-[14px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_4px_0_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#222] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isSignUp
                      ? "SIGN UP"
                      : "LOGIN"}
                </button>
              </div>

              {/* Switch Login / Signup */}
              <div className="pt-0.5 text-center text-[12px] text-[#24211e]">
                {!isSignUp ? (
                  <>
                    Don&apos;t Have An Account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(true)}
                      className="font-bold text-black hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already Have An Account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(false)}
                      className="font-bold text-black hover:underline"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;