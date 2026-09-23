import { useRef, useState, useEffect, useCallback } from "react";

export default function FloatingKeyboard({
  value = "",
  onChange,
  onEnter,
  isOpen = true,
  onClose,
  activeFieldName = "Team Name",
  onSwitchField,
  switchFieldLabel,
  showInput = false,
  placeholder = "Enter name",
}) {
  const [internalOpen, setInternalOpen] = useState(true);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const keyboardRef = useRef(null);
  const dragStartRef = useRef(null);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const pressKey = (key) => {
    if (!onChange) return;
    if (key === "BACKSPACE") {
      onChange(value.slice(0, -1));
    } else if (key === "SPACE") {
      onChange(value + " ");
    } else if (key === "CLEAR") {
      onChange("");
    } else if (key === "ENTER") {
      onEnter?.();
    } else {
      onChange(value + key);
    }
  };

  // Viewport-clamped dragging using pointer events (supports mouse & touch)
  const startDrag = (e) => {
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

  // Standard Key Style
  const keyStyle = {
    flex: 1,
    height: 31,
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: 8,
    background: "rgba(255, 255, 255, 0.11)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    WebkitUserSelect: "none",
    transition: "background 0.12s ease, transform 0.08s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    touchAction: "manipulation",
  };

  return (
    <>
      {/* Optional Standalone Input */}
      {showInput && (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter?.();
          }}
          placeholder={placeholder}
          className="w-full text-center text-lg sm:text-2xl font-bold tracking-wider outline-none transition-all shadow-xl"
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 16,
            background: "#fffdf9",
            border: "2px solid #ecd5bd",
            outline: "none",
            color: "#2b1404",
            fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
          }}
        />
      )}

      {/* FLOATING KEYBOARD POPUP */}
      {open && (
        <div
          ref={keyboardRef}
          style={{
            position: "fixed",
            zIndex: 9999,
            width: "min(94vw, 490px)",
            left: position ? `${position.x}px` : "50%",
            top: position ? `${position.y}px` : "auto",
            bottom: position ? "auto" : "16px",
            transform: position ? "none" : "translateX(-50%)",
            background: "rgba(32, 14, 5, 0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "2px solid rgba(245, 158, 11, 0.65)",
            borderRadius: 20,
            padding: "10px 12px",
            boxShadow:
              "0 18px 45px rgba(25, 8, 2, 0.6), 0 0 25px rgba(245, 158, 11, 0.2)",
            touchAction: "none",
            boxSizing: "border-box",
          }}
        >
          {/* DRAGGABLE HEADER */}
          <div
            onPointerDown={startDrag}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
              marginBottom: 8,
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              color: "#ffedd5",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.08em",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            {/* Title & Grip */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ opacity: 0.5, fontSize: 13, letterSpacing: "-1px" }}>
                ⠿
              </span>
              <span style={{ color: "#ffd56b" }}>KEYBOARD</span>
              {activeFieldName && (
                <span
                  style={{
                    background: "rgba(245, 158, 11, 0.25)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    fontSize: 10,
                    fontWeight: 700,
                    marginLeft: 4,
                  }}
                >
                  Editing: <strong>{activeFieldName}</strong>
                </span>
              )}
            </div>

            {/* Header Right Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {onSwitchField && (
                <button
                  type="button"
                  onClick={onSwitchField}
                  style={{
                    background: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#ffd56b",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                  title={switchFieldLabel || "Switch Field"}
                >
                  ⇄ {switchFieldLabel || "Switch"}
                </button>
              )}

              {/* Close / Minimize Button */}
              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: 24,
                  height: 24,
                  border: 0,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.16)",
                  color: "#ffedd5",
                  fontSize: 16,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                  transition: "background 0.15s ease",
                }}
                title="Hide keyboard"
              >
                ×
              </button>
            </div>
          </div>

          {/* KEYS ROWS */}
          {keys.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 5,
              }}
            >
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => pressKey(key)}
                  style={keyStyle}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.92)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* BOTTOM ACTIONS ROW: CLEAR, BACKSPACE, SPACE, ENTER */}
          <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
            <button
              type="button"
              onClick={() => pressKey("CLEAR")}
              style={{
                ...keyStyle,
                flex: 1.1,
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.8)",
                background: "rgba(255, 255, 255, 0.08)",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              CLEAR
            </button>

            <button
              type="button"
              onClick={() => pressKey("BACKSPACE")}
              style={{
                ...keyStyle,
                flex: 1.3,
                fontSize: 11,
                background: "rgba(220, 38, 38, 0.28)",
                border: "1px solid rgba(239, 68, 68, 0.45)",
                color: "#fecaca",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ⌫ DEL
            </button>

            <button
              type="button"
              onClick={() => pressKey("SPACE")}
              style={{
                ...keyStyle,
                flex: 3.2,
                fontSize: 11,
                letterSpacing: "0.1em",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.92)")
              }
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
                flex: 1.8,
                fontSize: 11,
                fontWeight: 900,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#230e03",
                border: "1px solid rgba(255, 235, 175, 0.7)",
                boxShadow: "0 2px 10px rgba(245, 158, 11, 0.4)",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.92)")
              }
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