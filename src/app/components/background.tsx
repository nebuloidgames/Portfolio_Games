"use client";

import { useEffect, useRef } from "react";

const TRIANGLE_BASE = 48;

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Build / rebuild the triangle grid on mount and on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createTriangleSet = (row: number) => {
      const el = document.createElement("div");
      el.classList.add("triangle-set");
      if (row % 2 === 0) el.classList.add("triangle-set--offset");
      container.appendChild(el);
    };

    const instantiateGrid = () => {
      container.innerHTML = "";
      const width = window.innerWidth;
      const height = window.innerHeight;

      const columns = Math.ceil(width / (TRIANGLE_BASE * 2)) + 1;
      const rows = Math.ceil((height / TRIANGLE_BASE) * 1.733) + 1;
      container.style.setProperty("--columns", String(columns));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          createTriangleSet(y);
        }
      }
    };

    instantiateGrid();
    window.addEventListener("resize", instantiateGrid);
    return () => window.removeEventListener("resize", instantiateGrid);
  }, []);

  // Move the glow with the cursor
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouseMove = (event: MouseEvent) => {
      glow.style.top = `${event.pageY}px`;
      glow.style.left = `${event.pageX}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div aria-hidden="true" className="bg-hero">
      <div id="bg-glow" ref={glowRef} />
      <div className="bg-triangle-container" ref={containerRef} />

      <style>{`
        @property --glow-color {
          syntax: "<color>";
          inherits: false;
          initial-value: #ADF5FF;
        }

        .bg-hero {
          --gap: 0.125rem;
          --triangle-base: 3rem;
          --triangle-base-height: calc(1.733 * var(--triangle-base));
          --triangle-width: calc(var(--triangle-base) - var(--gap));
          --triangle-height: calc(var(--triangle-base-height) - var(--gap));

          /* Self-positioning: fixed + inset-0 means this never takes
             up space in whatever layout it's dropped into (no flow,
             no grid-row, no flex-item sizing) and always covers the
             viewport, regardless of the parent's own position value.
             So you never need to add "fixed"/"relative" to the file
             that renders <Background />. */
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;

          background: radial-gradient(#2C666E, #0e111f);
          background-size: 400% 400%;
          background-position: 100% 100%;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          animation: bg-animation 20s alternate infinite;
        }

        @keyframes bg-animation {
          from { background-position: 0% 0%; }
          to { background-position: 400% 400%; }
        }

        #bg-glow {
          position: absolute;
          width: 50vw;
          height: 100vw;
          background: radial-gradient(circle closest-side, var(--glow-color), transparent);
          animation: glow-animation 5.2s ease infinite alternate;
          transform: translate(-50%, -50%);
        }

        @keyframes glow-animation {
          from {
            --glow-color: #ADF5FF;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            --glow-color: #FF6978;
            transform: translate(-50%, -50%) scale(1) rotate(90deg);
          }
        }

        .bg-triangle-container {
          display: grid;
          grid-template-columns: repeat(var(--columns), calc(var(--triangle-base) * 2 + var(--gap)));
          width: 100%;
          height: 100%;
        }

        .triangle-set {
          display: inline-block;
          position: relative;
          width: calc(var(--triangle-base) * 2 + var(--gap));
          height: var(--triangle-base-height);
        }

        .triangle-set--offset {
          transform: translateX(calc(-1 * var(--triangle-base) - 0.5 * var(--gap)));
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
          border-bottom: var(--triangle-height) solid #070711;
        }

        .triangle-set::after {
          right: calc(var(--gap) * 2.5);
          border-top: var(--triangle-height) solid #070711;
        }
      `}</style>
    </div>
  );
}