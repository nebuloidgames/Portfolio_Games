"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive space layer that reacts to the pointer:
 *
 *   - parallax   writes --mx / --my (-1..1) on <html> so the background
 *                layers can drift at different depths
 *   - stars      a drifting field; near the cursor they swell, glow, get
 *                pulled in and connect to it with thin lines
 *   - sparks     a glowing trail of coloured sparkles behind the cursor
 *   - click      a shockwave ring that shoves the stars outward
 *   - idle       an occasional shooting star
 *
 * Canvas only; pointer-events are off, so it never blocks the UI. It does
 * nothing at all for users who prefer reduced motion.
 */

const COLORS = ["#7c4dff", "#ff4fd8", "#36e0ff", "#ffffff"];
const REACH = 220;

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  life: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function SpaceFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const root = document.documentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // No hover on touch screens, so skip the whole layer there (saves battery)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const sparks: Spark[] = [];
    const rings: Ring[] = [];
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 3500;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const lastSpawn = { x: 0, y: 0 };
    let active = false;
    let glowAlpha = 0;

    const makeStars = () => {
      const count = w < 768 ? 45 : 110;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (target.x === 0 && target.y === 0) {
        target.x = cur.x = w / 2;
        target.y = cur.y = h / 2;
      }
      makeStars();
    };

    const spawnSparks = (n: number) => {
      const cap = w < 768 ? 14 : 32;
      for (let i = 0; i < n && sparks.length < cap; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        sparks.push({
          x: cur.x + (Math.random() - 0.5) * 8,
          y: cur.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15,
          life: 0,
          max: 30 + Math.random() * 35,
          size: 0.9 + Math.random() * 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      active = true;

      const moved = Math.hypot(target.x - lastSpawn.x, target.y - lastSpawn.y);
      if (moved > 42) {
        lastSpawn.x = target.x;
        lastSpawn.y = target.y;
        if (Math.random() < 0.55) spawnSparks(1);
      }
    };

    const onLeave = () => {
      active = false;
    };

    const onDown = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rings.push({ x, y, r: 0, life: 0 });

      // shockwave: shove nearby stars away from the click
      for (const s of stars) {
        const dx = s.x - x;
        const dy = s.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 320) {
          const push = (1 - d / 320) * 9;
          s.vx += (dx / d) * push;
          s.vy += (dy / d) * push;
        }
      }
      // burst of sparks
      const savedX = cur.x;
      const savedY = cur.y;
      cur.x = x;
      cur.y = y;
      spawnSparks(w < 768 ? 3 : 7);
      cur.x = savedX;
      cur.y = savedY;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    let skip = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      // idle (no cursor, nothing flying): draw every other frame
      const idle = !active && sparks.length === 0 && rings.length === 0;
      if (idle) {
        skip = !skip;
        if (skip) return;
      }
      const dt = Math.min(50, now - last) / 16.67;
      last = now;

      // ease the cursor and publish parallax
      cur.x += (target.x - cur.x) * Math.min(1, 0.18 * dt);
      cur.y += (target.y - cur.y) * Math.min(1, 0.18 * dt);
      const px = active ? (cur.x / w - 0.5) * 2 : 0;
      const py = active ? (cur.y / h - 0.5) * 2 : 0;
      root.style.setProperty("--mx", px.toFixed(3));
      root.style.setProperty("--my", py.toFixed(3));

      glowAlpha += ((active ? 1 : 0) - glowAlpha) * Math.min(1, 0.08 * dt);

      ctx.clearRect(0, 0, w, h);

      // soft light following the cursor
      if (glowAlpha > 0.01) {
        const g = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, 240);
        g.addColorStop(0, `rgba(124,77,255,${0.14 * glowAlpha})`);
        g.addColorStop(0.5, `rgba(255,79,216,${0.05 * glowAlpha})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cur.x - 240, cur.y - 240, 480, 480);
      }

      // star field
      for (const s of stars) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 1 - 0.02 * dt;
        s.vy *= 1 - 0.02 * dt;
        // gentle ambient drift so they never fully stop
        s.vx += (Math.random() - 0.5) * 0.01 * dt;
        s.vy += (Math.random() - 0.5) * 0.01 * dt;

        if (s.x < -10) s.x = w + 10;
        else if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        else if (s.y > h + 10) s.y = -10;

        const tw = 0.55 + 0.45 * Math.sin(now / 700 + s.phase);
        let alpha = 0.35 * tw;
        let radius = s.r;

        if (active) {
          const dx = cur.x - s.x;
          const dy = cur.y - s.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH) {
            const k = 1 - d / REACH;
            // pulled gently toward the cursor
            s.vx += (dx / (d || 1)) * 0.03 * k * dt;
            s.vy += (dy / (d || 1)) * 0.03 * k * dt;
            alpha = Math.min(1, alpha + k * 0.75);
            radius = s.r * (1 + k * 1.8);

            ctx.strokeStyle = `rgba(200,180,255,${k * 0.4})`;
            ctx.lineWidth = 0.6 + k * 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(235,228,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // sparkle trail
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life += dt;
        if (p.life >= p.max) {
          sparks.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - 0.03 * dt;
        p.vy *= 1 - 0.03 * dt;
        const t = 1 - p.life / p.max;
        const size = p.size * (0.4 + t);

        ctx.globalAlpha = t * 0.07;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = t * 0.38;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // click shockwaves
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.life += dt;
        r.r += 7 * dt;
        const t = 1 - r.life / 45;
        if (t <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255,79,216,${t * 0.7})`;
        ctx.lineWidth = 1 + t * 3;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(54,224,255,${t * 0.45})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      }

      // occasional shooting star
      if (!meteor && now > nextMeteor) {
        const fromTop = Math.random() > 0.4;
        meteor = {
          x: fromTop ? Math.random() * w * 0.7 : -20,
          y: fromTop ? -20 : Math.random() * h * 0.4,
          vx: 11 + Math.random() * 5,
          vy: 5 + Math.random() * 3,
          life: 0,
        };
      }
      if (meteor) {
        meteor.life += dt;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        const fade = Math.max(0, 1 - meteor.life / 70);
        const tail = 110;
        const len = Math.hypot(meteor.vx, meteor.vy);
        const tx = meteor.x - (meteor.vx / len) * tail;
        const ty = meteor.y - (meteor.vy / len) * tail;
        const g = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${0.9 * fade})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();
        if (fade <= 0 || meteor.x > w + 40 || meteor.y > h + 40) {
          meteor = null;
          nextMeteor = now + 4500 + Math.random() * 5000;
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        pointerEvents: "none",
      }}
    />
  );
}
