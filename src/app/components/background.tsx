/**
 * Dark space background, drawn entirely in code: a near-black violet sky
 * with a painterly nebula (violet, magenta, red, coral) glowing in the
 * bottom-left corner, diagonal wisps, teal star dust, and pure black on the
 * right.
 *
 * Self-positioning (absolute, inset-0): it fills whatever section renders it
 * and never takes part in that section's layout.
 */
export default function Background() {
  return (
    <div aria-hidden="true" className="nbg">
      {/* SVG filter that roughens the nebula edges so it reads as paint/gas */}
      <svg width="0" height="0" className="nbg-defs">
        <filter id="nbgPaint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="4" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="55" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="nbg-par">
      <div className="nbg-drift">
        <div className="nbg-neb">
          {/* colour body, concentrated bottom-left */}
          <Blob left="-12%" top="44%" w="62%" h="72%" c="rgba(75,42,205,.78)" />
          <Blob left="-8%" top="62%" w="48%" h="54%" c="rgba(205,40,180,.95)" />
          <Blob left="8%" top="80%" w="42%" h="40%" c="rgba(240,50,85,.92)" />
          <Blob left="19%" top="91%" w="28%" h="24%" c="rgba(255,100,70,.88)" />
          <Blob left="28%" top="60%" w="38%" h="36%" c="rgba(130,40,165,.36)" />
          <Blob left="50%" top="84%" w="28%" h="28%" c="rgba(200,40,75,.34)" />

        </div>

        {/* diagonal wisps rising up and to the right */}
        <span className="nbg-wisp" style={wisp("30%", "76%", "42%", "2.2%", -32, "linear-gradient(90deg, transparent, rgba(150,205,205,.38) 45%, rgba(215,120,150,.34) 75%, transparent)")} />
        <span className="nbg-wisp" style={wisp("12%", "68%", "36%", "5.5%", -30, "linear-gradient(90deg, transparent, rgba(225,60,150,.42) 50%, transparent)")} />
        <span className="nbg-wisp" style={wisp("-2%", "60%", "32%", "3%", -35, "linear-gradient(90deg, transparent, rgba(125,145,225,.4) 55%, transparent)")} />
      </div>
      </div>

      {/* teal star dust, thickest in the nebula corner */}
      <div className="nbg-dust" />
      {/* faint sky stars */}
      <div className="nbg-stars nbg-tw1" />
      <div className="nbg-stars nbg-stars-2 nbg-tw2" />
      <Flare className="nbg-tw1" left="14%" top="26%" size={52} glow="rgba(150,120,255,.5)" delay="-1s" />
      <Flare className="nbg-tw2 nbg-flare-wide" left="88%" top="16%" size={64} glow="rgba(255,79,216,.4)" />

      {/* keeps the top very dark and the right edge pure black */}
      <div className="nbg-shade" />

      <style>{`
        .nbg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(180deg, #06030e 0%, #0a0517 50%, #12082b 100%);
        }
        .nbg-defs { position: absolute; }

        /* --mx / --my (-1..1) come from SpaceFx; nearer layers move more */
        .nbg-par {
          position: absolute;
          inset: 0;
          transform: translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -9px), 0);
        }
        .nbg-drift {
          position: absolute;
          inset: -3%;
          transform-origin: 15% 100%;
          will-change: transform;
          animation: nbgDrift 60s ease-in-out infinite;
        }
        .nbg-neb {
          position: absolute;
          inset: 0;
          filter: url(#nbgPaint);
        }
        .nbg-blob {
          position: absolute;
          background: radial-gradient(closest-side, var(--c), transparent);
        }
        .nbg-wisp {
          position: absolute;
          display: block;
          filter: blur(3px);
          transform-origin: 0 50%;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 20%, #000 70%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 20%, #000 70%, transparent);
        }

        .nbg-dust {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1.6px 1.6px at 6% 12%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 18% 30%, #9fe8e0, transparent),
            radial-gradient(1.3px 1.3px at 31% 8%, #b7f0ea, transparent),
            radial-gradient(1px 1px at 44% 26%, #9fe8e0, transparent),
            radial-gradient(1.5px 1.5px at 57% 15%, #b7f0ea, transparent),
            radial-gradient(1px 1px at 70% 34%, #9fe8e0, transparent),
            radial-gradient(1.2px 1.2px at 83% 9%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 94% 28%, #b7f0ea, transparent),
            radial-gradient(1.4px 1.4px at 12% 52%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 26% 66%, #b7f0ea, transparent),
            radial-gradient(1.2px 1.2px at 39% 48%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 52% 72%, #9fe8e0, transparent),
            radial-gradient(1.5px 1.5px at 66% 58%, #b7f0ea, transparent),
            radial-gradient(1px 1px at 79% 76%, #9fe8e0, transparent),
            radial-gradient(1.2px 1.2px at 90% 54%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 8% 86%, #b7f0ea, transparent),
            radial-gradient(1.4px 1.4px at 22% 92%, #9fe8e0, transparent),
            radial-gradient(1px 1px at 47% 88%, #9fe8e0, transparent);
          background-size: 340px 300px;
          opacity: .85;
          -webkit-mask-image: radial-gradient(ellipse 75% 65% at 18% 100%, #000 15%, transparent 75%);
          mask-image: radial-gradient(ellipse 75% 65% at 18% 100%, #000 15%, transparent 75%);
        }

        .nbg-stars {
          position: absolute;
          inset: -40px;
          transform: translate3d(calc(var(--mx, 0) * -26px), calc(var(--my, 0) * -16px), 0);
          background-image:
            radial-gradient(1px 1px at 19% 46%, #fff, transparent),
            radial-gradient(1.4px 1.4px at 33% 21%, #fff, transparent),
            radial-gradient(1px 1px at 52% 9%, #fff, transparent),
            radial-gradient(1px 1px at 68% 38%, #fff, transparent),
            radial-gradient(1.4px 1.4px at 84% 17%, #fff, transparent),
            radial-gradient(1px 1px at 41% 71%, #fff, transparent);
          background-size: 520px 480px;
          opacity: .6;
        }
        .nbg-stars-2 {
          background-image:
            radial-gradient(1px 1px at 12% 30%, #cfe4ff, transparent),
            radial-gradient(1px 1px at 61% 24%, #cfe4ff, transparent),
            radial-gradient(1px 1px at 79% 66%, #ffe9cf, transparent),
            radial-gradient(0.8px 0.8px at 27% 88%, #fff, transparent);
          background-size: 330px 300px;
        }
        .nbg-flare {
          position: absolute;
          transform: translate3d(calc(var(--mx, 0) * -42px), calc(var(--my, 0) * -26px), 0);
        }
        .nbg-flare i { position: absolute; display: block; }
        .nbg-tw1 { animation: nbgTwinkle 4s ease-in-out infinite; }
        .nbg-tw2 { animation: nbgTwinkle 6.5s ease-in-out infinite reverse; }

        .nbg-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2,1,8,.55) 0%, transparent 45%),
            linear-gradient(90deg, transparent 48%, rgba(0,0,0,.82) 100%);
        }

        @keyframes nbgDrift {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.06) translate(12px, -8px); }
        }
        @keyframes nbgTwinkle { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }

        /* phones: skip the displacement filter and the drift so it stays smooth */
        @media (max-width: 767px) {
          .nbg-flare-wide { display: none; }
          .nbg-neb { filter: none; }
          .nbg-drift { animation: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nbg-drift, .nbg-tw1, .nbg-tw2 { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Blob({
  left,
  top,
  w,
  h,
  c,
}: {
  left: string;
  top: string;
  w: string;
  h: string;
  c: string;
}) {
  return (
    <div
      className="nbg-blob"
      style={{ left, top, width: w, height: h, ["--c" as string]: c }}
    />
  );
}

function wisp(
  left: string,
  top: string,
  width: string,
  height: string,
  deg: number,
  background: string,
) {
  return { left, top, width, height, background, transform: `rotate(${deg}deg)` };
}

function Flare({
  className,
  left,
  top,
  size,
  glow,
  delay,
}: {
  className: string;
  left: string;
  top: string;
  size: number;
  glow: string;
  delay?: string;
}) {
  const mid = size / 2;
  const core = Math.round(size / 5);
  return (
    <div
      className={`nbg-flare ${className}`}
      style={{ left, top, width: size, height: size, animationDelay: delay }}
    >
      <i
        style={{
          left: mid - 1,
          top: 0,
          width: 2,
          height: size,
          background: "linear-gradient(transparent, #fff, transparent)",
        }}
      />
      <i
        style={{
          top: mid - 1,
          left: 0,
          height: 2,
          width: size,
          background: "linear-gradient(90deg, transparent, #fff, transparent)",
        }}
      />
      <i
        style={{
          left: mid - core / 2,
          top: mid - core / 2,
          width: core,
          height: core,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 0 16px 6px ${glow}`,
        }}
      />
    </div>
  );
}
