"use client";

import { useEffect, useRef } from "react";

const TRIANGLE_BASE = 48; // px

export default function Background() {
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-following glow
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const glow = glowRef.current;
      if (!glow) return;

      glow.style.transform = `translate3d(
        ${event.clientX - 350}px,
        ${event.clientY - 350}px,
        0
      )`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Responsive triangle grid
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instantiateGrid = () => {
      container.innerHTML = "";

      const width = document.body.clientWidth;
      const height = document.body.clientHeight;

      const columns = Math.ceil(width / (TRIANGLE_BASE * 2)) + 1;
      const rows = Math.ceil(height / (TRIANGLE_BASE * 1.733)) + 1;

      container.style.setProperty("--columns", String(columns));

      const fragment = document.createDocumentFragment();

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const el = document.createElement("div");
          el.classList.add("triangle-set");
          if (y % 2 === 0) el.classList.add("triangle-set--offset");
          fragment.appendChild(el);
        }
      }

      container.appendChild(fragment);
    };

    instantiateGrid();
    window.addEventListener("resize", instantiateGrid);
    return () => window.removeEventListener("resize", instantiateGrid);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Mouse-following glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[700px] w-[700px] rounded-full blur-[90px] transition-transform duration-200 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(91, 92, 102, 0.45) 0%, rgba(51, 51, 73, 0.4) 32%, rgba(51, 51, 73, 0.4) 100%)",
        }}
      />

      {/* Triangle grid (CSS-border mosaic, generated responsively) */}
      <div
        ref={containerRef}
        className="triangle-container absolute inset-0 opacity-[0.22]"
      />

      {/* Center glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,215,80,0.10), transparent 58%)",
        }}
      />

      <style jsx global>{`
        :root {
          --gap: 0.125rem;
          --triangle-base: 3rem;
          --triangle-base-height: calc(1.733 * var(--triangle-base));
          --triangle-width: calc(var(--triangle-base) - var(--gap));
          --triangle-height: calc(var(--triangle-base-height) - var(--gap));
        }

        .triangle-container {
          display: grid;
          grid-template-columns: repeat(
            var(--columns),
            calc(var(--triangle-base) * 2 + var(--gap))
          );
        }

        .triangle-set {
          display: inline-block;
          position: relative;
          width: calc(var(--triangle-base) * 2 + var(--gap));
          height: var(--triangle-base-height);
        }

        .triangle-set--offset {
          transform: translateX(
            calc(-1 * var(--triangle-base) - 0.5 * var(--gap))
          );
        }

        .triangle-set::before,
        .triangle-set::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top: var(--gap);
          border-right: var(--triangle-width) solid transparent;
          border-left: var(--triangle-width) solid transparent;
        }

        .triangle-set::before {
          left: calc(-1 * var(--triangle-base));
          border-bottom: var(--triangle-height) solid rgba(201, 184, 184, 0.54);
        }

        .triangle-set::after {
          right: calc(var(--gap) * 2.5);
          border-top: var(--triangle-height) solid rgba(179, 168, 168, 0.66);
        }
      `}</style>
    </div>
  );
}