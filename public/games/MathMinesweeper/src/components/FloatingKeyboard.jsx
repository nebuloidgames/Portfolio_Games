import { useRef, useState, useEffect } from "react";
import { playClick } from "../utils/audio";

export default function FloatingKeyboard({
  isOpen = false,
  onClose,
  value = "",
  onChange,
  onEnter,
}) {
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);

  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const pressKey = (key) => {
    try {
      playClick();
    } catch {
      // ignore
    }

    if (key === "BACKSPACE") {
      onChange(value.slice(0, -1));
    } else if (key === "SPACE") {
      onChange(value + " ");
    } else if (key === "ENTER") {
      onEnter?.();
    } else {
      onChange(value + key);
    }
  };

  const startDrag = (e) => {
    const point = e.touches?.[0] || e;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();

    dragRef.current = {
      startX: point.clientX,
      startY: point.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    };

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const drag = (e) => {
    if (!dragRef.current) return;

    const point = e.touches?.[0] || e;
    const d = dragRef.current;

    setPosition({
      x: Math.max(8, Math.min(window.innerWidth - 320, d.startLeft + point.clientX - d.startX)),
      y: Math.max(8, Math.min(window.innerHeight - 180, d.startTop + point.clientY - d.startY)),
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
  };

  if (!isOpen) return null;

  const keyStyle = {
    flex: 1,
    height: 30,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    background: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition: "background 0.1s, transform 0.1s",
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        width: "min(92vw, 420px)",
        left: position ? position.x : "50%",
        top: position ? position.y : "auto",
        bottom: position ? "auto" : "20px",
        transform: position ? "none" : "translateX(-50%)",
        background: "linear-gradient(145deg, rgba(14, 38, 77, 0.96) 0%, rgba(8, 22, 46, 0.97) 100%)",
        border: "1.5px solid rgba(56, 189, 248, 0.7)",
        borderRadius: 16,
        padding: 8,
        boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(56, 189, 248, 0.2)",
        backdropFilter: "blur(12px)",
      }}
      onPointerMove={drag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      {/* DRAG HEADER */}
      <div
        onPointerDown={startDrag}
        style={{
          cursor: "grab",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 8px",
          marginBottom: 6,
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          color: "#93c5fd",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          userSelect: "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>⌨️</span>
          <span>ON-SCREEN KEYBOARD</span>
        </span>

        <button
          onClick={onClose}
          style={{
            width: 22,
            height: 22,
            border: 0,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
          title="Close Keyboard"
        >
          ×
        </button>
      </div>

      {/* KEYS */}
      {keys.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => pressKey(key)}
              style={keyStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)")}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* BOTTOM ROW */}
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => pressKey("BACKSPACE")}
          style={{
            ...keyStyle,
            flex: 1.6,
            background: "rgba(239, 68, 68, 0.25)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            fontSize: "11px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)")}
        >
          ⌫ DEL
        </button>

        <button
          onClick={() => pressKey("SPACE")}
          style={{ ...keyStyle, flex: 3.5, fontSize: "11px" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)")}
        >
          SPACE
        </button>

        <button
          onClick={() => pressKey("ENTER")}
          style={{
            ...keyStyle,
            flex: 1.8,
            background: "linear-gradient(90deg, #10b981, #059669)",
            border: "1px solid rgba(52, 211, 153, 0.6)",
            fontSize: "11px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          ENTER ↵
        </button>
      </div>
    </div>
  );
}