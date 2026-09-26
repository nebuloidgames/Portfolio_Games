"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const GAME_IMAGES = [
  "/flappy bird.jpeg",
  "/catch the brand.jpeg",
  "/2048 race.jpeg",
  "/memory sequence.png",
];

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

      if (!data.success) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      /*
       * ADMIN → Admin Dashboard
       * USER  → Our Games
       */
      if (data.user?.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/our-games";
      }
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
    <section className="relative min-h-[calc(100dvh-110px)] w-full overflow-hidden bg-transparent">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-[8%] h-[85%] w-[42%] -skew-x-[12deg] rounded-[40px] bg-[#7C4DFF]/25"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-180px] left-[-100px] h-[360px] w-[360px] rounded-full bg-[#FF4FD8]/25 blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-110px)] w-full max-w-[1450px] items-center px-5 py-8 sm:px-8 lg:px-14">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

          {/* LEFT — GAME VISUAL */}
          <div className="hidden lg:block">
            <div className="max-w-[650px]">

              {/* Brand label */}
              <div className="mb-5 inline-flex border-2 border-white/20 bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] text-white px-4 py-2 shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                <span className="font-[family-name:var(--font-russo)] text-[15px] font-bold uppercase tracking-[0.15em]">
                  NEBULOID GAMES
                </span>
              </div>

              {/* Main heading */}
              <h1 className="font-[family-name:var(--font-russo)] text-[clamp(3.5rem,5.5vw,5.8rem)] font-bold leading-[0.9] tracking-[-0.04em] text-white">
                PLAY.
                <br />
                THINK.
                <br />
                <span className="relative inline-block">
                  CHALLENGE.
                  <span className="absolute bottom-[-8px] left-0 h-[7px] w-[72%] bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] text-white" />
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-[560px] text-[20px] leading-8 text-white/70">
                <b>Enter the world of Nebuloid Games and challenge your
                logic, speed, memory, creativity, and reaction skills.</b>
              </p>

              {/* Game image collage */}
              <div className="relative mt-9 h-[315px] w-full max-w-[650px]">

                {/* Image 1 — Flappy Bird */}
                <div className="absolute left-0 top-[55px] h-[215px] w-[150px] -rotate-[8deg] overflow-hidden rounded-[12px] border-2 border-white/20 bg-white/[0.07] shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                  <Image
                    src={GAME_IMAGES[0]}
                    alt="Flappy Bird"
                    fill
                    priority
                    unoptimized
                    quality={100}
                    sizes="150px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Image 2 — Catch The Brand */}
                <div className="absolute left-[120px] top-[10px] z-10 h-[250px] w-[175px] -rotate-[3deg] overflow-hidden rounded-[12px] border-2 border-white/20 bg-white/[0.07] shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                  <Image
                    src={GAME_IMAGES[1]}
                    alt="Catch the Brand"
                    fill
                    priority
                    unoptimized
                    quality={100}
                    sizes="175px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Image 3 — 2048 Race */}
                <div className="absolute left-[275px] top-[32px] z-20 h-[270px] w-[185px] rotate-[3deg] overflow-hidden rounded-[12px] border-2 border-white/20 bg-white/[0.07] shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                  <Image
                    src={GAME_IMAGES[2]}
                    alt="2048 Race"
                    fill
                    priority
                    unoptimized
                    quality={100}
                    sizes="185px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Image 4 — Memory Sequence */}
                <div className="absolute left-[445px] top-[70px] z-10 h-[215px] w-[150px] rotate-[8deg] overflow-hidden rounded-[12px] border-2 border-white/20 bg-white/[0.07] shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                  <Image
                    src={GAME_IMAGES[3]}
                    alt="Memory Sequence"
                    fill
                    priority
                    unoptimized
                    quality={100}
                    sizes="150px"
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Games count */}
              <div className="mt-3 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-black" />

                <span className="text-[18px] font-bold uppercase tracking-[0.14em] text-white/70">
                  <b>18 Interactive Games</b>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — LOGIN CARD */}
          <div className="flex justify-center lg:justify-end">
            <div
              className={`w-full ${
                isSignUp ? "max-w-[470px]" : "max-w-[440px]"
              }`}
            >

              {/* Card */}
              <div className="overflow-hidden rounded-[24px] border-2 border-white/20 bg-[#0c0820]/80 backdrop-blur-md shadow-[0_0_24px_rgba(124,77,255,0.4)]">

                {/* Card Header */}
                <div className="border-b-2 border-white/20 bg-white/[0.06] px-7 py-5 sm:px-9">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-[family-name:var(--font-russo)] text-[22px] font-bold uppercase tracking-[0.16em] text-white/70">
                        <b>NEBULOID</b>
                      </p>

                      <h2 className="mt-1 font-[family-name:var(--font-russo)] text-[30px] font-bold leading-none text-white sm:text-[34px]">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                      </h2>
                    </div>

                    {/* N Logo */}
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] text-white text-[20px] font-black shadow-[0_0_24px_rgba(124,77,255,0.4)]">
                      N
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-7 py-7 sm:px-9 sm:py-8">

                  <p className="mb-6 text-[20px] leading-6 text-white/70">
                  <b>  {isSignUp
                      ? "Request access to the Nebuloid Games platform."
                      : "Log in to continue playing and exploring our games."}</b>
                  </p>

                  <form
                    onSubmit={
                      isSignUp ? handleRequestAccess : handleLogin
                    }
                    className="flex flex-col gap-4"
                  >

                    {/* Error */}
                    {error && (
                      <div className="rounded-[10px] border border-red-400/40 bg-red-500/15 px-3 py-2.5 text-center text-[14px] leading-snug text-red-300">
                        {error}
                      </div>
                    )}

                    {/* Success */}
                    {success && (
                      <div className="rounded-[10px] border border-green-400/40 bg-green-500/15 px-3 py-2.5 text-center text-[14px] leading-snug text-green-300">
                        {success}
                      </div>
                    )}

                    {!isSignUp ? (
                      <>
                        {/* Username */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em] text-white/70">
                            Username
                          </label>

                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                            className="h-[54px] w-full rounded-[9px] border border-white/25 bg-white/[0.07] px-4 text-[17px] text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-[#FF4FD8]/50"
                          />
                        </div>

                        {/* Password */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em] text-white/70">
                            Password
                          </label>

                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="h-[54px] w-full rounded-[9px] border border-white/25 bg-white/[0.07] px-4 text-[17px] text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-[#FF4FD8]/50"
                          />
                        </div>

                        {/* Remember + Forgot Password */}
                        <div className="flex items-center justify-between text-[14px] text-white/70">

                          <label className="flex cursor-pointer items-center gap-2 select-none">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="h-[16px] w-[16px] accent-[#FF4FD8]"
                            />

                            <span>Remember Me</span>
                          </label>

                          <Link
                            href="/"
                            className="font-medium text-[#9EC5FF] hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Full Name */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em] text-white/70">
                            Full Name
                          </label>

                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            autoComplete="name"
                            required
                            className="h-[52px] w-full rounded-[9px] border border-white/25 bg-white/[0.07] px-4 text-[17px] text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-[#FF4FD8]/50"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em] text-white/70">
                            Email
                          </label>

                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            className="h-[52px] w-full rounded-[9px] border border-white/25 bg-white/[0.07] px-4 text-[17px] text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-[#FF4FD8]/50"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-bold uppercase tracking-[0.08em] text-white/70">
                            Phone Number
                          </label>

                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                            className="h-[52px] w-full rounded-[9px] border border-white/25 bg-white/[0.07] px-4 text-[17px] text-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-[#FF4FD8]/50"
                          />
                        </div>

                        {/* Terms */}
                        <label className="flex cursor-pointer items-start gap-2 text-[13px] leading-[1.5] text-white/70 select-none">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            required
                            className="mt-[3px] h-[15px] w-[15px] shrink-0 accent-[#FF4FD8]"
                          />

                          <span>
                            I agree to the{" "}
                            <span className="font-bold text-white">
                              Terms of Service
                            </span>{" "}
                            and{" "}
                            <span className="font-bold text-white">
                              Privacy Policy
                            </span>
                          </span>
                        </label>
                      </>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 flex h-[54px] w-full items-center justify-center rounded-[8px] border-2 border-white/20 bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] text-white px-6 font-[family-name:var(--font-russo)] text-[16px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(124,77,255,0.4)] transition-all duration-150 hover:-translate-y-[1px] hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "PLEASE WAIT..."
                        : isSignUp
                          ? "REQUEST ACCESS →"
                          : "LOGIN →"}
                    </button>

                    {/* Login / Signup Switch */}
                    <div className="pt-1 text-center text-[14px] text-white/70">
                      {!isSignUp ? (
                        <>
                          Don&apos;t Have An Account?{" "}

                          <button
                            type="button"
                            onClick={() => switchMode(true)}
                            className="font-bold text-white hover:underline"
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
                            className="font-bold text-white hover:underline"
                          >
                            Login
                          </button>
                        </>
                      )}
                    </div>

                  </form>
                </div>
              </div>

              {/* Bottom Text */}
              <p className="mt-5 text-center text-[22px] uppercase tracking-[0.12em] text-white/70">
               <b> Play. Think. Challenge Yourself.</b>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Login;