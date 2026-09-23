import React from "react";

const Card = ({ card, isFlipped, isMatched, onClick, disabled }) => {
  const isRevealed = isFlipped || isMatched;
  
  const cardClass = `relative w-full aspect-[3/4] cursor-pointer transition-transform duration-300 transform [perspective:1000px] ${
    disabled || isMatched ? 'opacity-90 cursor-default' : 'hover:scale-[1.03] hover:shadow-md'
  }`;

  const ariaLabel = isRevealed
    ? `${card.lbl} card`
    : "Hidden memory card";

  return (
    <button
      className={cardClass}
      onClick={() => onClick(card)}
      disabled={disabled || isMatched}
      aria-label={ariaLabel}
      type="button"
    >
      <div 
        className={`w-full h-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] ${
          isRevealed ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front (Hidden state, warm cream with golden question mark) */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-[#fffdf9] rounded-xl border-2 border-[#d9c0a5] flex items-center justify-center shadow-sm overflow-hidden">
          <span 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f4be5c] select-none"
            style={{ 
              textShadow: "0 2px 4px rgba(180, 110, 20, 0.22)",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
            }}
          >
            ?
          </span>
        </div>

        {/* Back (Revealed state, showing math expression / value) */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl flex items-center justify-center border-2 transition-colors duration-300 p-2 text-center ${
          isMatched 
            ? 'bg-[#fef7ea] border-[#e8a838] shadow-[inset_0_0_12px_rgba(232,168,56,0.35)]' 
            : 'bg-white border-[#d9c0a5] shadow-sm'
        }`}>
          <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-[#381804] transition-transform duration-300 ${isMatched ? 'scale-110 font-black text-[#b56510]' : ''}`}>
            {card.lbl}
          </span>
        </div>
      </div>
    </button>
  );
};

export default React.memo(Card);

