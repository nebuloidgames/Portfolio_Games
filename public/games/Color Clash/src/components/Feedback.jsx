import React from 'react';

export default function Feedback({ feedback }) {
  if (!feedback) return null;

  const isCorrect = feedback.type === 'correct';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Centered Popup Card */}
      <div
        className={`relative flex flex-col items-center justify-center min-w-[220px] sm:min-w-[260px] px-6 py-5 rounded-2xl border-3 shadow-2xl transition-all duration-200 animate-feedback-center ${
          isCorrect
            ? 'bg-white border-black text-black'
            : 'bg-white border-rose-600 text-black'
        }`}
        style={{
          boxShadow: isCorrect
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.35)'
            : '0 20px 40px -15px rgba(225, 29, 72, 0.35)'
        }}
      >
        {/* Icon Circle */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black mb-2 shadow-md ${
            isCorrect
              ? 'bg-black text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {isCorrect ? '✓' : '✕'}
        </div>

        {/* Main Title Message */}
        <span
          className={`text-xl sm:text-2xl font-black tracking-wider uppercase ${
            isCorrect ? 'text-black' : 'text-rose-600'
          }`}
        >
          {isCorrect ? 'CORRECT!' : 'INCORRECT!'}
        </span>

        {/* Subtext (Points / Streak) */}
        {feedback.subtext && (
          <span
            className={`text-xs sm:text-sm font-extrabold tracking-wide mt-1 ${
              isCorrect ? 'text-emerald-700' : 'text-neutral-500'
            }`}
          >
            {feedback.subtext}
          </span>
        )}
      </div>
    </div>
  );
}


