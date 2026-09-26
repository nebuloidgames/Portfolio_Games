"use client";

import { useEffect } from "react";
import Hero from "./components/Hero";
import Games from "./our-games/components/Game";

export default function Home() {
  useEffect(() => {
    // Lock scrolling only while the home page is mounted.
    const html = document.documentElement;
    const body = document.body;

    const oldHtmlOverflow = html.style.overflow;
    const oldBodyOverflow = body.style.overflow;
    const oldHtmlHeight = html.style.height;
    const oldBodyHeight = body.style.height;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.height = "100%";

    window.scrollTo(0, 0);

    return () => {
      html.style.overflow = oldHtmlOverflow;
      body.style.overflow = oldBodyOverflow;
      html.style.height = oldHtmlHeight;
      body.style.height = oldBodyHeight;
    };
  }, []);

  return (
    <main
      className="fixed inset-x-0 top-[76px] bottom-0 z-10 w-full overflow-hidden overscroll-none"
    >
      <Hero />
    </main>
  );
}
