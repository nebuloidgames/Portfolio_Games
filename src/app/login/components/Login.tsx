"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      router.push(data.user?.role === "ADMIN" ? "/admin/dashboard" : "/");
      router.refresh();
    } catch {
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
      // The current backend accepts name + email for access requests.
      // Phone is intentionally kept as a UI field only so the existing
      // database/auth flow is not changed just for this visual redesign.
      const res = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch {
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
    <section className="relative h-[calc(100dvh-69px)] min-h-0 w-full overflow-hidden bg-[#F4F0E7]">
      {/* Blurred home-page preview behind the form */}
      <div
        aria-hidden="true"
        className="absolute inset-[-24px] scale-[1.06] overflow-hidden pointer-events-none select-none"
      >
        <div className="absolute inset-0 bg-[#F4F0E7]" />
        <div className="absolute left-[-5%] right-[-5%] top-[10%] h-[72%] flex items-center justify-center gap-5 opacity-75 blur-[9px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] w-[205px] shrink-0 rounded-[18px] border border-black/20 bg-[#FFFDF8] shadow-[5px_6px_0_rgba(0,0,0,0.12)]"
            >
              <div className="h-[245px] rounded-t-[18px] bg-gradient-to-br from-[#eef3ff] via-white to-[#fff1bd] p-5">
                <div className="mx-auto mt-4 h-[105px] w-[105px] rounded-full bg-[#2563eb] shadow-[12px_14px_0_rgba(17,24,39,0.12)]" />
                <div className="mt-8 flex justify-center gap-3">
                  <div className="h-16 w-16 rotate-[-8deg] rounded-[8px] bg-[#fbbf24]" />
                  <div className="mt-2 h-14 w-14 rotate-[20deg] rounded-[8px] bg-[#10b981]" />
                </div>
              </div>
              <div className="h-[55px] rounded-b-[18px] bg-[#0b0b0d]" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[#F4F0E7]/45" />
      </div>

      {/* Warm yellow accent from the home page */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-8%] h-[120%] w-[43%] -translate-x-1/2 -skew-x-[15deg] bg-[#FFE7A8]/55 blur-[10px] pointer-events-none"
      />

      {/* Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-6 sm:px-6">
        <div
          className={`w-full overflow-hidden rounded-[24px] border border-black/35 bg-[#FFF2D3]/90 shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-[16px] ${
            isSignUp ? "max-w-[452px]" : "max-w-[452px]"
          }`}
        >
          <div className="px-7 py-7 sm:px-10 sm:py-8">
            <h1 className="mb-5 text-center font-serif text-[34px] font-normal leading-none tracking-tight text-black sm:text-[36px]">
              {isSignUp ? "Sign up" : "Log in"}
            </h1>

            <form
              onSubmit={isSignUp ? handleRequestAccess : handleLogin}
              className="flex flex-col gap-3"
            >
              {error && (
                <div className="rounded-[10px] border border-red-300 bg-red-50 px-3 py-2 text-center text-[12px] leading-snug text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-[10px] border border-green-300 bg-green-50 px-3 py-2 text-center text-[12px] leading-snug text-green-700">
                  {success}
                </div>
              )}

              {!isSignUp ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="User Name"
                    autoComplete="username"
                    required
                    className="h-[49px] w-full rounded-[11px] border border-black/50 bg-[#FFF5DD]/75 px-4 text-[16px] text-black outline-none placeholder:text-[#6f6a63] focus:border-black focus:ring-1 focus:ring-black/20"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="h-[49px] w-full rounded-[11px] border border-black/50 bg-[#FFF5DD]/75 px-4 text-[16px] text-black outline-none placeholder:text-[#6f6a63] focus:border-black focus:ring-1 focus:ring-black/20"
                  />

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
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    autoComplete="name"
                    required
                    className="h-[49px] w-full rounded-[11px] border border-black/50 bg-[#FFF5DD]/75 px-4 text-[16px] text-black outline-none placeholder:text-[#6f6a63] focus:border-black focus:ring-1 focus:ring-black/20"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E- mail"
                    autoComplete="email"
                    required
                    className="h-[49px] w-full rounded-[11px] border border-black/50 bg-[#FFF5DD]/75 px-4 text-[16px] text-black outline-none placeholder:text-[#6f6a63] focus:border-black focus:ring-1 focus:ring-black/20"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    autoComplete="tel"
                    className="h-[49px] w-full rounded-[11px] border border-black/50 bg-[#FFF5DD]/75 px-4 text-[16px] text-black outline-none placeholder:text-[#6f6a63] focus:border-black focus:ring-1 focus:ring-black/20"
                  />

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
                      <span className="font-bold text-black">Terms of Service</span>{" "}
                      and{" "}
                      <span className="font-bold text-black">Privacy Policy</span>
                    </span>
                  </label>
                </>
              )}

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[36px] min-w-[166px] rounded-[11px] border border-black/35 bg-[#FFF4D8] px-7 font-serif text-[14px] font-normal uppercase tracking-[0.05em] text-black shadow-none transition hover:bg-[#FFE9B5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait..." : isSignUp ? "SIGN UP" : "LOGIN"}
                </button>
              </div>

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
