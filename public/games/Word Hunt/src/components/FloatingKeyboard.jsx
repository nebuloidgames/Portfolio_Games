import React, { useRef, useState, useEffect } from "react";

export default function FloatingKeyboard({
  isOpen,
  onClose,
  value = "",
  onChange,
  onEnter,
  targetLabel = "Keyboard"
}) {
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);

  // Reset position or initialize on open
  useEffect(() => {
    if (isOpen && !position) {
      // Default position at bottom center
      setPosition(null);
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const pressKey = (key) => {
    if (key === "BACKSPACE") {
      onChange(value.slice(0, -1));
    } else if (key === "SPACE") {
      onChange(value + " ");
    } else if (key === "ENTER") {
      if (onEnter) onEnter();
      if (onClose) onClose();
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
      x: Math.max(10, Math.min(window.innerWidth - 450, d.startLeft + point.clientX - d.startX)),
      y: Math.max(10, Math.min(window.innerHeight - 220, d.startTop + point.clientY - d.startY)),
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
  };

  const keyStyle = {
    flex: 1,
    height: 32,
    border: "1px solid rgba(255, 255, 255, 0.22)",
    borderRadius: 6,
    background: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    userSelect: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 99999,
        width: "min(92vw, 440px)",
        left: position ? position.x : "50%",
        top: position ? position.y : "auto",
        bottom: position ? "auto" : "20px",
        transform: position ? "none" : "translateX(-50%)",
        background: "linear-gradient(180deg, rgba(16, 47, 114, 0.95) 0%, rgba(9, 29, 78, 0.95) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "2px solid #25d5ff",
        borderRadius: 18,
        padding: "10px 12px 12px",
        boxShadow: "0 16px 40px rgba(0, 10, 40, 0.6), 0 0 16px rgba(37, 213, 255, 0.3)",
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
          padding: "6px 10px",
          marginBottom: 8,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 10,
          color: "#ffffff",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "13px" }}>⌨️</span>
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.5px" }}>
            {targetLabel ? targetLabel.toUpperCase() : "KEYBOARD"}
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            border: 0,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close keyboard"
        >
          ✕
        </button>
      </div>

      {/* CURRENT VALUE PREVIEW */}
      <div
        style={{
          background: "rgba(0, 10, 30, 0.4)",
          border: "1px solid rgba(37, 213, 255, 0.4)",
          borderRadius: 8,
          padding: "5px 10px",
          marginBottom: 8,
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
          minHeight: 18,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value ? value : <span style={{ opacity: 0.5 }}>Type a name...</span>}
      </div>

      {/* KEYS ROWS */}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37, 213, 255, 0.35)";
                e.currentTarget.style.borderColor = "#25d5ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.22)";
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* BOTTOM ACTION ROW */}
      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
        <button
          onClick={() => pressKey("BACKSPACE")}
          style={{
            ...keyStyle,
            flex: 1.5,
            background: "rgba(239, 68, 68, 0.25)",
            borderColor: "rgba(239, 68, 68, 0.4)",
          }}
          title="Backspace"
        >
          ⌫ DEL
        </button>

        <button
          onClick={() => pressKey("SPACE")}
          style={{
            ...keyStyle,
            flex: 3.5,
            background: "rgba(255, 255, 255, 0.18)",
          }}
        >
          SPACE
        </button>

        <button
          onClick={() => pressKey("ENTER")}
          style={{
            ...keyStyle,
            flex: 1.8,
            background: "linear-gradient(90deg, #08cfff, #1764ff)",
            borderColor: "#25d5ff",
            fontWeight: 800,
          }}
        >
          DONE ↵
        </button>
      </div>
    </div>
  );
}