import { useRef, useState, useEffect, useCallback } from "react";

export default function FloatingKeyboard({
  value,
  onChange,
  onEnter,
  autoOpen = true,
  placeholder = "Enter your name",
}) {
  const [open, setOpen] = useState(autoOpen);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const keyboardRef = useRef(null);
  const dragStartRef = useRef(null);

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
      onEnter?.();
      setOpen(false);
    } else {
      onChange(value + key);
    }
  };

  // Robust, viewport-clamped drag handler using window pointer events
  const startDrag = (e) => {
    // Only drag with primary mouse button or touch
    if (e.button !== undefined && e.button !== 0) return;

    const point = e.touches?.[0] || e;
    const kb = keyboardRef.current;
    if (!kb) return;

    const rect = kb.getBoundingClientRect();
    dragStartRef.current = {
      startX: point.clientX,
      startY: point.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      width: rect.width,
      height: rect.height,
    };

    setIsDragging(true);
  };

  const handlePointerMove = useCallback((e) => {
    if (!dragStartRef.current) return;
    const point = e.touches?.[0] || e;
    const d = dragStartRef.current;

    const deltaX = point.clientX - d.startX;
    const deltaY = point.clientY - d.startY;

    const minX = 8;
    const maxX = Math.max(minX, window.innerWidth - d.width - 8);
    const minY = 8;
    const maxY = Math.max(minY, window.innerHeight - d.height - 8);

    const newX = Math.max(minX, Math.min(maxX, d.startLeft + deltaX));
    const newY = Math.max(minY, Math.min(maxY, d.startTop + deltaY));

    setPosition({ x: newX, y: newY });
  }, []);

  const stopDrag = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopDrag);
      window.addEventListener("pointercancel", stopDrag);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", stopDrag);
        window.removeEventListener("pointercancel", stopDrag);
      };
    }
  }, [isDragging, handlePointerMove, stopDrag]);

  // Small, compact key style
  const keyStyle = {
    flex: 1,
    height: 30,
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "inherit",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition: "background 0.15s, transform 0.1s",
  };

  return (
    <>
      {/* NAME INPUT */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className="w-full text-center text-lg sm:text-2xl font-bold tracking-wider text-white placeholder:text-white/40 outline-none transition-all shadow-xl"
        style={{
          width: "100%",
          padding: "16px 24px",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "2px solid #f88626",
          outline: "none",
          color: "white",
        }}
      />

      {/* COMPACT FLOATING KEYBOARD */}
      {open && (
        <div
          ref={keyboardRef}
          style={{
            position: "fixed",
            zIndex: 9999,
            width: "min(92vw, 440px)",
            left: position ? `${position.x}px` : "50%",
            top: position ? `${position.y}px` : "auto",
            bottom: position ? "auto" : "14px",
            transform: position ? "none" : "translateX(-50%)",
            background: "rgba(16, 47, 114, 0.96)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1.5px solid #25d5ff",
            borderRadius: 16,
            padding: "8px 10px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.5), 0 0 20px rgba(37, 213, 255, 0.2)",
            touchAction: "none",
          }}
        >
          {/* DRAG HEADER */}
          <div
            onPointerDown={startDrag}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 8px",
              marginBottom: 6,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "white",
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: "0.12em",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ opacity: 0.6 }}>⋮⋮</span> ON-SCREEN KEYBOARD
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                width: 22,
                height: 22,
                border: 0,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                fontSize: 14,
                lineHeight: "22px",
                textAlign: "center",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Close keyboard"
            >
              ×
            </button>
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
                  type="button"
                  onClick={() => pressKey(key)}
                  style={keyStyle}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* BOTTOM ROW: BACKSPACE, SPACE, ENTER */}
          <div style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              onClick={() => pressKey("BACKSPACE")}
              style={{ ...keyStyle, flex: 1.4, fontSize: 11 }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ⌫ DEL
            </button>

            <button
              type="button"
              onClick={() => pressKey("SPACE")}
              style={{ ...keyStyle, flex: 3.5, fontSize: 11 }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              SPACE
            </button>

            <button
              type="button"
              onClick={() => pressKey("ENTER")}
              style={{
                ...keyStyle,
                flex: 1.5,
                fontSize: 11,
                background: "linear-gradient(90deg, #08cfff, #1764ff)",
                boxShadow: "0 2px 8px rgba(8, 207, 255, 0.4)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ENTER ↵
            </button>
          </div>
        </div>
      )}
    </>
  );
}