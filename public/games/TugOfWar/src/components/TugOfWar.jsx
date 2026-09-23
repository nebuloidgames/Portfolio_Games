import { useState, useEffect, useCallback, useRef } from "react";
import newBgSrc from "../assets/new-bg.png";
import tugRopeSrc from "../assets/tugEmoji.png";
import towSignSrc from "../assets/tow-sign.png";
import nurseryIcon from "../assets/Nursery.png";
import primaryIcon from "../assets/Primary.png";
import middleIcon from "../assets/Middle.png";
import highIcon from "../assets/High.png";
import gamerIcon from "../assets/Gamer.png";
import nebuloidLogo from "../assets/nebuloid-logo.png";
import CertificateModal from "./CertificateModal";
import "./tugOfWar.css";

// TYPES
const TARGET_SCORE = 10;

const TUG_DIFFICULTY = {
  Nursery: {
    maxVal: 9,
    minVal: 0,
    ops: ["+"],
    name: "Nursery",
    icon: nurseryIcon,
  },
  Primary: {
    maxVal: 99,
    minVal: 10,
    ops: ["+", "−"],
    name: "Primary",
    icon: primaryIcon,
  },
  Middle: {
    maxVal: 250,
    minVal: 50,
    ops: ["+", "−", "×", "÷"],
    name: "Middle",
    icon: middleIcon,
  },
  High: {
    maxVal: 500,
    minVal: 100,
    ops: ["+", "−", "×", "÷"],
    name: "High",
    icon: highIcon,
  },
  Gamer: {
    maxVal: 5000,
    minVal: 200,
    ops: ["+", "−", "×", "÷"],
    name: "Gamer",
    icon: gamerIcon,
  },
};

const ROBOT_DELAYS = {
  Nursery: 5000,
  Primary: 4000,
  Middle: 3500,
  High: 2800,
  Gamer: 2000,
};

const randInt = (min, max) => {
  if (min > max) [min, max] = [max, min];
  if (min === max) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateQuestion = (difficulty = "Primary") => {
  try {
    const diff = TUG_DIFFICULTY[difficulty] || TUG_DIFFICULTY.Primary;
    const ops = diff.ops;
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a, b, ans;

    switch (op) {
      case "+": {
        a = randInt(diff.minVal, diff.maxVal);
        b = randInt(diff.minVal, diff.maxVal);
        ans = a + b;
        break;
      }
      case "−": {
        a = randInt(diff.minVal, diff.maxVal);
        b = randInt(diff.minVal, diff.maxVal);
        if (b > a) [a, b] = [b, a];
        ans = a - b;
        break;
      }
      case "×": {
        const maxFactor = Math.min(20, Math.floor(Math.sqrt(diff.maxVal)));
        a = randInt(2, Math.max(2, maxFactor));
        b = randInt(2, Math.max(2, maxFactor));
        ans = a * b;
        break;
      }
      case "÷": {
        b = randInt(2, Math.min(12, Math.max(2, diff.maxVal)));
        const maxQuotient = Math.max(1, Math.floor(diff.maxVal / b));
        ans = randInt(1, Math.min(20, maxQuotient));
        a = b * ans;
        break;
      }
      default: {
        a = randInt(1, 10);
        b = randInt(1, 10);
        ans = a + b;
      }
    }

    if (!Number.isFinite(ans) || ans < 0 || !Number.isInteger(ans)) {
      throw new Error("Generated answer is invalid");
    }

    return { a, op, b, eq: `${a} ${op} ${b}`, ans };
  } catch (error) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return { a, op: "+", b, eq: `${a} + ${b}`, ans: a + b };
  }
};

/* ═══════════════════════════════════════════
   NUMPAD COMPONENT (Blue & Orange Themes)
   Matches exact reference UI:
   - Counter Badge: ✓ 0/10
   - Score Badge: Score 0
   - Card Body: "Your Answer" Header
   - Recessed Display Screen
   - 3x4 Button Grid (1-9, Red ✕, Blue 0, Green ✓)
   ═══════════════════════════════════════════ */
function TowNumpad({ team, input, flash, score, isRobot, onKeyPress }) {
  const isA = team === "A";
  const side = isA ? "a" : "b";

  let displayClass = "tow-pad__display";
  if (flash === "correct") displayClass += " tow-pad__display--ok";
  else if (flash === "wrong") displayClass += " tow-pad__display--err";

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={`tow-pad-wrapper tow-pad-wrapper--${side}`}>
      {/* 1. Counter Badge: ✓ 0/10 */}
      <div className={`tow-badge-counter tow-badge-counter--${side}`}>
        <span className="tow-badge-check">✓</span>
        <span className="tow-badge-count">
          {score}/{TARGET_SCORE}
        </span>
      </div>

      {/* 2. Score Badge: Score 0 */}
      {/* <div className={`tow-badge-score tow-badge-score--${side}`}>
        Score {score}
      </div> */}

      {/* 3. Calculator Card */}
      <div className={`tow-pad-card tow-pad-card--${side}`}>
        {/* Header Tab: Your Answer */}
        <div className={`tow-pad-header tow-pad-header--${side}`}>
          Your Answer
        </div>

        {/* Input Screen */}
        <div className={displayClass}>
          {input ? (
            <span className="tow-pad__display-val">{input}</span>
          ) : isRobot ? (
            <span className="tow-pad__display-placeholder tow-robot-pulse">
              BOT...
            </span>
          ) : (
            <span className="tow-pad__display-placeholder" />
          )}
        </div>

        {/* 3x4 Keys Grid */}
        <div className="tow-pad-grid">
          {numKeys.map((n) => (
            <button
              key={n}
              type="button"
              className={`tow-key tow-key--${side}`}
              onClick={() => onKeyPress(String(n))}
            >
              {n}
            </button>
          ))}

          {/* Row 4: Red Cancel ✕, Blue 0, Green Submit ✓ */}
          <button
            type="button"
            className="tow-key tow-key--cancel"
            onClick={() => onKeyPress("X")}
            aria-label="Clear"
          >
            ✕
          </button>
          <button
            type="button"
            className="tow-key tow-key--zero"
            onClick={() => onKeyPress("0")}
          >
            0
          </button>
          <button
            type="button"
            className="tow-key tow-key--submit"
            onClick={() => onKeyPress("ok")}
            aria-label="Submit"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN TUG OF WAR COMPONENT
   ═══════════════════════════════════════════ */
const TugOfWar = ({ config, onClose }) => {
  const difficulty = config?.difficulty || "Primary";
  const mode = config?.mode || "team";
  const teamAName = config?.teamA || "Team A";
  const teamBName = config?.teamB || "Team B";

  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [scores, setScores] = useState([0, 0]);
  const [winner, setWinner] = useState(null);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [flashA, setFlashA] = useState(null);
  const [flashB, setFlashB] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certCountdown, setCertCountdown] = useState(5);

  const robotTimerRef = useRef(null);

  useEffect(() => {
    if (winner) return;

    if (scores[0] >= TARGET_SCORE) {
      setWinner(teamAName);
      config?.onGameOver?.();
    } else if (scores[1] >= TARGET_SCORE) {
      setWinner(mode === "robot" ? "Robot" : teamBName);
      config?.onGameOver?.();
    } else if (config?.timesUp) {
      if (scores[0] > scores[1]) {
        setWinner(teamAName);
      } else if (scores[1] > scores[0]) {
        setWinner(mode === "robot" ? "Robot" : teamBName);
      } else {
        setWinner("Tie");
      }
      config?.onGameOver?.();
    }
  }, [scores, winner, teamAName, teamBName, mode, config]);

  // Certificate eligibility & 5-second auto-trigger
  const canGetCertificate = Boolean(
    winner && winner !== "Tie" && (mode !== "robot" || winner === teamAName),
  );

  useEffect(() => {
    if (!canGetCertificate) {
      setShowCertificate(false);
      setCertCountdown(5);
      return;
    }

    setCertCountdown(5);
    const interval = setInterval(() => {
      setCertCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowCertificate(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canGetCertificate]);

  // Robot auto-solve behavior
  useEffect(() => {
    if (mode !== "robot" || winner || config?.timesUp) return;

    const baseDelay = ROBOT_DELAYS[difficulty] || 3500;
    const jitter = Math.random() * 1500;

    robotTimerRef.current = setTimeout(() => {
      // Simulate robot typing answer
      setInputB(String(question.ans));
      setTimeout(() => {
        setScores((prev) => [prev[0], prev[1] + 1]);
        setFlashB("correct");
        setTimeout(() => {
          setFlashB(null);
          setInputB("");
        }, 400);
        setQuestion(generateQuestion(difficulty));
      }, 500);
    }, baseDelay + jitter);

    return () => {
      if (robotTimerRef.current) clearTimeout(robotTimerRef.current);
    };
  }, [question, mode, winner, difficulty, config?.timesUp]);

  const handlePad = useCallback(
    (team, key) => {
      if (winner || config?.timesUp) return;

      try {
        const isA = team === "A";
        const currentInput = isA ? inputA : inputB;
        const setInput = isA ? setInputA : setInputB;
        const setFlash = isA ? setFlashA : setFlashB;

        if (key === "X") {
          setInput("");
          return;
        }

        if (key === "ok") {
          if (!currentInput) {
            setFlash("wrong");
            setTimeout(() => setFlash(null), 400);
            return;
          }

          const parsed = parseInt(currentInput, 10);
          if (isNaN(parsed)) {
            setFlash("wrong");
            setInput("");
            setTimeout(() => setFlash(null), 400);
            return;
          }

          if (parsed === question.ans) {
            setScores((prev) =>
              isA ? [prev[0] + 1, prev[1]] : [prev[0], prev[1] + 1],
            );
            setFlash("correct");
            setQuestion(generateQuestion(difficulty));
          } else {
            setFlash("wrong");
          }

          setInput("");
          setTimeout(() => setFlash(null), 400);
          return;
        }

        if (currentInput.length < 5) {
          setInput(currentInput + key);
        }
      } catch (error) {
        console.error("[TugOfWar] Numpad handler error:", error);
      }
    },
    [winner, inputA, inputB, question, difficulty, config?.timesUp],
  );

  // Handle physical keyboard input for Team A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (winner || config?.timesUp) return;
      if (e.key >= "0" && e.key <= "9") {
        handlePad("A", e.key);
      } else if (e.key === "Backspace") {
        handlePad("A", "X");
      } else if (e.key === "Enter") {
        handlePad("A", "ok");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePad, winner, config?.timesUp]);

  // Rope pull offset: Team A winning pulls left (negative translation), Team B pulls right
  // Clamped with MAX_PULL_PERCENT so contestants and rope never exit the screen boundaries
  const MAX_PULL_PERCENT = 14;
  const scoreDiff = scores[1] - scores[0];
  const pullProgress = Math.max(-1, Math.min(1, scoreDiff / TARGET_SCORE));
  const pullShiftPercent = pullProgress * MAX_PULL_PERCENT; // -14% to +14%

  const timeLeft = config?.timeLeft ?? 0;
  const timeLimit = config?.timeLimit ?? 120;
  const timerProgress = timeLimit
    ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))
    : 0;
  const timerMM = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const timerSS = (timeLeft % 60).toString().padStart(2, "0");
  const isTimerWarning = timeLeft <= 30 && timeLeft > 0;

  const currentDiffConfig =
    TUG_DIFFICULTY[difficulty] || TUG_DIFFICULTY.Primary;
  const diffIcon = currentDiffConfig.icon;

  /* ── WINNER MODAL ── */
  if (winner) {
    return (
      <div
        className="tow-container"
        style={{ backgroundImage: `url(${newBgSrc})` }}
      >
        <div className="tow-overlay" />
        <div className="tow-win-bg">
          <div className="tow-win-card">
            <div className="tow-win__trophy">
              {winner === "Tie" ? "🤝" : "🏆"}
            </div>
            <div className="tow-win__title">
              {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
            </div>
            <div className="tow-win__scores">
              {scores[0]} – {scores[1]}
            </div>

            {canGetCertificate && !showCertificate && (
              <div className="tow-cert-countdown-box">
                <div className="tow-cert-countdown-text">
                  <span>📜 Generating Certificate in</span>
                  <strong>{certCountdown}s</strong>
                </div>
                <button
                  type="button"
                  className="tow-cert-countdown-btn"
                  onClick={() => setShowCertificate(true)}
                >
                  View Certificate Now ➔
                </button>
              </div>
            )}

            <div className="tow-win__btns">
              {canGetCertificate && (
                <button
                  type="button"
                  className="tow-win__btn"
                  onClick={() => setShowCertificate(true)}
                  style={{
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 15px rgba(2, 132, 199, 0.4)",
                  }}
                >
                  Certificate
                </button>
              )}
              {config?.onPlayAgain && (
                <button
                  className="tow-win__btn tow-win__btn--play"
                  onClick={config.onPlayAgain}
                >
                  ▶ Play Again
                </button>
              )}
              {config?.onNewTimer && (
                <button
                  className="tow-win__btn tow-win__btn--lvl"
                  onClick={config.onNewTimer}
                >
                  Choose Level
                </button>
              )}
              <button
                className="tow-win__btn tow-win__btn--close"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* AUTOMATIC OR ON-DEMAND CERTIFICATE MODAL */}
        {showCertificate && canGetCertificate && (
          <CertificateModal
            winnerName={winner}
            difficulty={difficulty}
            mode={mode}
            scores={scores}
            onPlayAgain={() => {
              setShowCertificate(false);
              config?.onPlayAgain?.();
            }}
            onNewTimer={() => {
              setShowCertificate(false);
              config?.onNewTimer?.();
            }}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </div>
    );
  }

  /* ── MAIN GAME SCREEN ── */
  return (
    <div
      className="tow-container"
      style={{ backgroundImage: `url(${newBgSrc})` }}
    >
      {/* Background dark subtle vignette */}
      <div className="tow-overlay" />

      {/* Top Left: Nebuloid Studio Branding */}
      <div className="tow-top-left-brand" title="Nebuloid Tech Studio">
        <img src={nebuloidLogo} alt="Nebuloid" className="tow-brand-logo-img" />
      </div>

      {/* 1. TOP CENTER: Wooden "TUG OF WAR" hanging sign */}
      <header className="tow-sign-section">
        <img src={towSignSrc} alt="TUG OF WAR" className="tow-sign-image" />
      </header>

      {/* 2. CHARACTERS & ROPE TUG OF WAR ARENA LAYER */}
      <div className="tow-arena-stage" aria-hidden="true">
        <div
          className="tow-characters-track"
          style={{
            transform: `translateX(${pullShiftPercent}%)`,
          }}
        >
          <img
            src={tugRopeSrc}
            alt="Tug of War Contestants"
            className={`tow-characters-sprite ${
              flashA === "correct"
                ? "tow-characters-sprite--pull-a"
                : flashB === "correct"
                  ? "tow-characters-sprite--pull-b"
                  : ""
            }`}
          />
        </div>
      </div>

      {/* 3. MAIN GAME HUD (Left Pad, Center Bottom Question + Timer, Right Pad) */}
      <main className="tow-hud-layout">
        {/* Left Column (Team A - Blue) */}
        <section className="tow-col tow-col--left">
          <TowNumpad
            team="A"
            input={inputA}
            flash={flashA}
            score={scores[0]}
            isRobot={false}
            onKeyPress={(k) => handlePad("A", k)}
          />
        </section>

        {/* Center Bottom: Timer & "Solve It" Question Box */}
        <section className="tow-center-box-wrap">
          {/* Circular Timer Widget positioned directly above "Solve It" */}
          {config?.timeLimit != null && !config?.timesUp && (
            <div className="tow-center-timer-wrap">
              <div
                className={`tow-timer-dial ${isTimerWarning ? "tow-timer-dial--warn" : ""}`}
              >
                {/* Split ring / progress ring matching reference UI */}
                <div
                  className="tow-timer-ring-split"
                  style={{
                    background: `conic-gradient(from 0deg, #00d2ff 0% 50%, #f59e0b 50% 100%)`,
                  }}
                />
                <div className="tow-timer-core">
                  <svg
                    className="tow-timer-clock-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="13" r="7.5" />
                    <polyline
                      points="12 9.5 12 13 14.5 14.5"
                      strokeLinecap="round"
                    />
                    <path d="M5 3.5 L2.5 6" strokeLinecap="round" />
                    <path d="M19 3.5 L21.5 6" strokeLinecap="round" />
                  </svg>
                  <span className="tow-timer-digits">
                    {timerMM}:{timerSS}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="tow-solve-card">
            <div className="tow-solve-header">
              <span className="tow-solve-line" />
              <span className="tow-solve-title">
                {diffIcon && (
                  <img
                    src={diffIcon}
                    alt={difficulty}
                    className="tow-diff-icon"
                    title={`Difficulty: ${difficulty}`}
                  />
                )}
                Solve It
              </span>
              <span className="tow-solve-line" />
            </div>

            <div className="tow-equation-row">
              <span className="tow-eq-operand">{question.a}</span>
              <span className="tow-eq-operator">{question.op}</span>
              <span className="tow-eq-operand">{question.b}</span>
              <span className="tow-eq-equal">=</span>
              <span className="tow-eq-question">?</span>
            </div>
          </div>
        </section>

        {/* Right Column (Team B - Orange / Robot) */}
        <section className="tow-col tow-col--right">
          <TowNumpad
            team="B"
            input={inputB}
            flash={flashB}
            score={scores[1]}
            isRobot={mode === "robot"}
            onKeyPress={(k) => handlePad("B", k)}
          />
        </section>
      </main>
    </div>
  );
};

export default TugOfWar;
