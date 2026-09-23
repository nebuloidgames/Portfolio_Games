import React from 'react';

/**
 * 3D Flag icon matching reference design
 */
export const FlagIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={`drop-shadow-sm ${className}`} fill="none">
    {/* Pole */}
    <rect x="7" y="5" width="2.5" height="24" rx="1.2" fill="#1E293B" />
    <circle cx="8.25" cy="5" r="2" fill="#F59E0B" />
    {/* Red Flag Fabric with gradient & wave */}
    <path
      d="M9 6 L26 12 L9 18 Z"
      fill="url(#flagGrad)"
      stroke="#991B1B"
      strokeWidth="0.75"
    />
    {/* Flag fold shadow */}
    <path d="M9 12 L20 12 L9 18 Z" fill="rgba(0,0,0,0.12)" />
    <defs>
      <linearGradient id="flagGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Left Isometric Board (Numbers & Flags)
 */
export const LeftIsometricBoard = ({ className = '' }) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        transform: 'perspective(1200px) rotateX(36deg) rotateY(16deg) rotateZ(-20deg) scale(1.02)',
        transformOrigin: 'bottom left',
      }}
    >
      {/* Board Base Frame with 3D Depth */}
      <div className="bg-[#E4E9F2] p-3 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.14),0_10px_0_#C5CEDD] border border-white/60">
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-3xl font-extrabold text-[#2563EB]">
            1
          </div>
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-3xl font-extrabold text-[#16A34A]">
            2
          </div>
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />

          {/* Row 2 */}
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center">
            <FlagIcon className="w-9 h-9" />
          </div>
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-3xl font-extrabold text-[#2563EB]">
            1
          </div>
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-3xl font-extrabold text-[#DC2626]">
            3
          </div>
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center">
            <FlagIcon className="w-9 h-9" />
          </div>

          {/* Row 3 */}
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-3xl font-extrabold text-[#2563EB]">
            1
          </div>
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />

          {/* Row 4 */}
          <div className="w-14 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center">
            <FlagIcon className="w-9 h-9" />
          </div>
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-14 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
        </div>
      </div>
    </div>
  );
};

/**
 * Right Isometric Board (Math Equations & Flags)
 */
export const RightIsometricBoard = ({ className = '' }) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        transform: 'perspective(1200px) rotateX(36deg) rotateY(-16deg) rotateZ(20deg) scale(1.02)',
        transformOrigin: 'bottom right',
      }}
    >
      {/* Board Base Frame with 3D Depth */}
      <div className="bg-[#E4E9F2] p-3 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.14),0_10px_0_#C5CEDD] border border-white/60">
        <div className="grid grid-cols-3 gap-2">
          {/* Row 1 */}
          <div className="w-16 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-xl font-black text-[#2563EB] tracking-tight">
            3 + 2
          </div>
          <div className="w-16 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-xl font-black text-[#DC2626] tracking-tight">
            7 − 4
          </div>
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />

          {/* Row 2 */}
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-16 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-xl font-black text-[#F59E0B] tracking-tight">
            8 ÷ 4
          </div>

          {/* Row 3 */}
          <div className="w-16 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center font-game text-xl font-black text-[#16A34A] tracking-tight">
            6 × 2
          </div>
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />

          {/* Row 4 */}
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
          <div className="w-16 h-14 bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center justify-center">
            <FlagIcon className="w-9 h-9" />
          </div>
          <div className="w-16 h-14 bg-gradient-to-b from-[#FFFFFF] to-[#E2E8F0] rounded-xl shadow-[0_3px_0_#CBD5E1] border border-white/80" />
        </div>
      </div>
    </div>
  );
};
