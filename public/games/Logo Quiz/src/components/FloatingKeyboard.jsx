import { useRef, useState, useEffect } from "react";

const NUMBER_ROW = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];

export default function FloatingKeyboard({
  isOpen,
  targetLabel = "Keyboard",
  value = "",
  onChange,
  onClose,
  onDone,
}) {
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  // Reset or center position if opened first time
  useEffect(() => {
    if (isOpen && !position) {
      // Default to center-bottom of screen
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const kbW = Math.min(screenW * 0.92, 360);
      setPosition({
        x: Math.max(10, (screenW - kbW) / 2),
        y: Math.max(20, screenH - 250),
      });
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const handleKeyPress = (char, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!onChange) return;

    if (value.length < 16) {
      onChange(value + char);
    }
  };

  const handleBackspace = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!onChange) return;
    onChange(value.slice(0, -1));
  };

  const handleClear = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!onChange) return;
    onChange("");
  };

  const handleSpace = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!onChange) return;
    if (value.length < 16 && value.length > 0 && !value.endsWith(" ")) {
      onChange(value + " ");
    }
  };

  const handleDone = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onDone?.();
    onClose?.();
  };

  // Drag handlers
  const handlePointerDown = (e) => {
    const point = e.touches?.[0] || e;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      startX: point.clientX,
      startY: point.clientY,
      initX: rect.left,
      initY: rect.top,
    };

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const point = e.touches?.[0] || e;
    const d = dragRef.current;
    const deltaX = point.clientX - d.startX;
    const deltaY = point.clientY - d.startY;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const kbW = Math.min(screenW * 0.92, 360);

    const newX = Math.max(8, Math.min(screenW - kbW - 8, d.initX + deltaX));
    const newY = Math.max(8, Math.min(screenH - 180, d.initY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fkb-container"
      style={{
        left: position ? `${position.x}px` : "50%",
        top: position ? `${position.y}px` : "auto",
        bottom: position ? "auto" : "20px",
        transform: position ? "none" : "translateX(-50%)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* DRAG HEADER */}
      <div
        className="fkb-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="fkb-header-drag-title">
          <svg
            className="fkb-drag-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
          <span>{targetLabel || "Keyboard"}</span>
        </div>

        <button
          type="button"
          className="fkb-close-btn"
          onClick={onClose}
          aria-label="Close Keyboard"
        >
          ✕
        </button>
      </div>

      {/* KEYBOARD GRID */}
      <div className="fkb-grid">
        {/* ROW 0: NUMBERS */}
        <div className="fkb-row">
          {NUMBER_ROW.map((num) => (
            <button
              key={num}
              type="button"
              className="fkb-key fkb-key-num"
              onPointerDown={(e) => handleKeyPress(num, e)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* ROW 1: Q - P */}
        <div className="fkb-row">
          {ROW_1.map((char) => (
            <button
              key={char}
              type="button"
              className="fkb-key"
              onPointerDown={(e) => handleKeyPress(char, e)}
            >
              {char}
            </button>
          ))}
        </div>

        {/* ROW 2: A - L */}
        <div className="fkb-row">
          {ROW_2.map((char) => (
            <button
              key={char}
              type="button"
              className="fkb-key"
              onPointerDown={(e) => handleKeyPress(char, e)}
            >
              {char}
            </button>
          ))}
        </div>

        {/* ROW 3: Z - M */}
        <div className="fkb-row">
          {ROW_3.map((char) => (
            <button
              key={char}
              type="button"
              className="fkb-key"
              onPointerDown={(e) => handleKeyPress(char, e)}
            >
              {char}
            </button>
          ))}
        </div>

        {/* ROW 4: ACTIONS (CLEAR, SPACE, BACKSPACE, DONE) */}
        <div className="fkb-row">
          <button
            type="button"
            className="fkb-key fkb-key-action fkb-key-clear"
            onPointerDown={handleClear}
            title="Clear all"
          >
            CLR
          </button>

          <button
            type="button"
            className="fkb-key fkb-key-action fkb-key-space"
            onPointerDown={handleSpace}
          >
            SPACE
          </button>

          <button
            type="button"
            className="fkb-key fkb-key-action fkb-key-backspace"
            onPointerDown={handleBackspace}
            title="Backspace"
          >
            ⌫
          </button>

          <button
            type="button"
            className="fkb-key fkb-key-action fkb-key-done"
            onPointerDown={handleDone}
            title="Done"
          >
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
}
