import React from "react";

const difficulties = [
  { key: "nursery", label: "Nursery", desc: "4 pairs" },
  { key: "primary", label: "Primary", desc: "6 pairs" },
  { key: "middle", label: "Middle", desc: "8 pairs" },
  { key: "high", label: "High", desc: "10 pairs" },
  { key: "gamer", label: "Gamer", desc: "12 pairs" },
];

const DifficultySelector = ({ difficulty, onSelect, disabled }) => {
  return (
    <div className="difficulty-selector">
      {difficulties.map((d) => (
        <button
          key={d.key}
          className={`difficulty-btn ${difficulty === d.key ? "difficulty-btn--active" : ""}`}
          onClick={() => onSelect(d.key)}
          disabled={disabled}
          aria-label={`${d.label} difficulty - ${d.desc}`}
          type="button"
        >
          <span className="difficulty-btn__label">{d.label}</span>
          <span className="difficulty-btn__desc">{d.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default React.memo(DifficultySelector);
