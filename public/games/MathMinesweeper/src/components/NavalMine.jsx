import React from 'react';

/**
 * 3D Naval Mine with metallic sphere, specular highlights, and red cylindrical spikes
 */
const NavalMine = ({ size = 80, className = '', style = {}, isBlurred = false }) => {
  const id = React.useId().replace(/:/g, '');

  return (
    <div
      className={`inline-block relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: isBlurred ? 'blur(4px)' : 'none',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 160 160"
        width="100%"
        height="100%"
        className="overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Sphere metallic gradient */}
          <radialGradient id={`mineGrad-${id}`} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="30%" stopColor="#2D3748" />
            <stop offset="70%" stopColor="#1A202C" />
            <stop offset="100%" stopColor="#0B0F17" />
          </radialGradient>

          {/* Red Spike gradient */}
          <linearGradient id={`spikeGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF384C" />
            <stop offset="50%" stopColor="#E52238" />
            <stop offset="100%" stopColor="#99101E" />
          </linearGradient>

          {/* Spike Cap gradient */}
          <radialGradient id={`spikeCap-${id}`} cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFA6B0" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          {/* Rim light */}
          <radialGradient id={`mineRim-${id}`} cx="75%" cy="75%" r="60%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.15)" />
          </radialGradient>

          {/* Specular spot */}
          <radialGradient id={`specular-${id}`} cx="35%" cy="32%" r="20%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="10" fill="rgba(15, 23, 42, 0.22)" filter="blur(6px)" />

        {/* --- Background / Radial Spikes (8 radial directions) --- */}
        {/* Helper spike macro: renders stalk + cap */}
        {[
          { angle: 0, length: 26 },    // Top
          { angle: 45, length: 26 },   // Top-Right
          { angle: 90, length: 26 },   // Right
          { angle: 135, length: 26 },  // Bottom-Right
          { angle: 180, length: 26 },  // Bottom
          { angle: 225, length: 26 },  // Bottom-Left
          { angle: 270, length: 26 },  // Left
          { angle: 315, length: 26 },  // Top-Left
        ].map((spike, i) => (
          <g key={i} transform={`rotate(${spike.angle} 80 80)`}>
            {/* Spike base ring */}
            <rect x="74" y="32" width="12" height="6" rx="2" fill="#1A202C" />
            {/* Spike stalk */}
            <path
              d="M74.5 34 L76 14 L84 14 L85.5 34 Z"
              fill={`url(#spikeGrad-${id})`}
            />
            {/* Spike round cap */}
            <ellipse cx="80" cy="14" rx="5.5" ry="3.5" fill={`url(#spikeCap-${id})`} />
          </g>
        ))}

        {/* --- Central Metallic Sphere --- */}
        <circle cx="80" cy="80" r="48" fill={`url(#mineGrad-${id})`} />
        <circle cx="80" cy="80" r="48" fill={`url(#mineRim-${id})`} />

        {/* Subtle rivet seams / panel curve */}
        <path
          d="M38 72 Q 80 88 122 72"
          fill="none"
          stroke="rgba(15, 23, 42, 0.7)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* --- Front-facing Spikes (facing viewer at 3D angles) --- */}
        {/* Front-center spike */}
        <g transform="translate(68, 68)">
          <circle cx="12" cy="12" r="11" fill="#111827" />
          <circle cx="12" cy="12" r="9" fill={`url(#spikeGrad-${id})`} />
          <circle cx="12" cy="12" r="7" fill={`url(#spikeCap-${id})`} />
          <circle cx="10" cy="10" r="2.5" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Front-top-right spike */}
        <g transform="translate(92, 54)">
          <circle cx="8" cy="8" r="8" fill="#111827" />
          <circle cx="8" cy="8" r="6.5" fill={`url(#spikeGrad-${id})`} />
          <circle cx="8" cy="8" r="5" fill={`url(#spikeCap-${id})`} />
        </g>

        {/* Front-bottom-left spike */}
        <g transform="translate(48, 92)">
          <circle cx="7" cy="7" r="7.5" fill="#111827" />
          <circle cx="7" cy="7" r="6" fill={`url(#spikeGrad-${id})`} />
          <circle cx="7" cy="7" r="4.5" fill={`url(#spikeCap-${id})`} />
        </g>

        {/* Specular Highlight Gloss */}
        <circle cx="80" cy="80" r="48" fill={`url(#specular-${id})`} />
        <ellipse cx="64" cy="56" rx="14" ry="9" transform="rotate(-30 64 56)" fill="rgba(255, 255, 255, 0.28)" />
      </svg>
    </div>
  );
};

export default NavalMine;
