import React, { useState, useEffect, useCallback, useRef } from "react";
import DifficultySelector from "./DifficultySelector";
import PlayerBoard from "./PlayerBoard";
import CertificateModal from "./CertificateModal";
import bgImg from "../assets/bg-img.png";
import nebuloidLogo from "../assets/nebuloid-logo.png";

function MemoryMatchGame({ config, onGoHome }) {
  const mode = config?.mode || "team";
  const teamA = config?.teamA || "Team A";
  const teamB = config?.teamB || (mode === "robot" ? "Robot" : "Team B");
  const initialDifficulty = config?.difficulty?.toLowerCase() || "primary";
  const initialTime = config?.timeLimit || 300;

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "timeup"
  const [winner, setWinner] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const timerRef = useRef(null);
  const TARGET_SCORE = 10;

  // Handle timer
  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameStatus("timeup");
            
            // Determine winner on timeout
            if (scoreA > scoreB) setWinner(teamA);
            else if (scoreB > scoreA) setWinner(teamB);
            else setWinner("TIE");
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus, scoreA, scoreB]);

  // Handle scoring and winning condition
  const handleScore = useCallback((team) => {
    if (team === "A") {
      setScoreA((prev) => {
        const newScore = prev + 1;
        if (newScore >= TARGET_SCORE) {
          setGameStatus("won");
          setWinner(teamA);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return newScore;
      });
    } else {
      setScoreB((prev) => {
        const newScore = prev + 1;
        if (newScore >= TARGET_SCORE) {
          setGameStatus("won");
          setWinner(teamB);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return newScore;
      });
    }
  }, [TARGET_SCORE, teamA, teamB]);

  const restartGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScoreA(0);
    setScoreB(0);
    setTimeLeft(initialTime);
    setGameStatus("playing");
    setWinner(null);
    setShowCertificate(false);
  }, [initialTime]);

  const onMatchA = useCallback(() => handleScore("A"), [handleScore]);
  const onMatchB = useCallback(() => handleScore("B"), [handleScore]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isBoardDisabled = gameStatus !== "playing";
  const isGameOver = gameStatus === "won" || gameStatus === "timeup";

  const boardKey = `${difficulty}-${gameStatus === "playing" ? "play" : "reset"}`;

  return (
    <main
      className="mm-screen mm-game-screen"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Top Header with Nebuloid Branding */}
      <header className="mm-game-header">
        <div className="absolute top-4 left-20" title="Nebuloid Tech Studio">
          <img
            src={nebuloidLogo}
            alt="Nebuloid Tech Studio"
            className="mm-branding-logo"
          />
        </div>
        <h1 className="mm-game-title">Math Memory Match</h1>
      </header>

      {/* Main Game Arena: Team A Board | Center Timer | Team B Board */}
      <section className="mm-game-arena" aria-label="Game Arena">
        {/* Team A Board */}
        <PlayerBoard 
          key={`A-${boardKey}`}
          teamName={teamA} 
          score={scoreA}
          difficulty={difficulty} 
          disabled={isBoardDisabled} 
          onMatch={onMatchA} 
          teamColor="#F59E0B"
        />

        {/* Center Circular Timer */}
        <div className="mm-timer-center">
          <span className="mm-timer-target">First To {TARGET_SCORE}</span>
          <div 
            className={`mm-timer-circle ${timeLeft <= 30 && gameStatus === "playing" ? "mm-timer-warning" : ""}`}
            title="Remaining Match Time"
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Team B Board */}
        <PlayerBoard 
          key={`B-${boardKey}`}
          teamName={teamB} 
          score={scoreB}
          difficulty={difficulty} 
          disabled={isBoardDisabled} 
          onMatch={onMatchB} 
          teamColor="#10B981"
          isRobot={mode === "robot"}
        />
      </section>

      {/* Bottom Bar matching reference image */}
      <footer className="mm-bottom-bar">
        <button 
          className="mm-pill-btn"
          onClick={restartGame} 
          type="button"
        >
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.4} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          <span>Reset Match</span>
        </button>
      </footer>

      {/* Game Over Modal overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans animate-fade-in">
          <div className="mm-panel text-center max-w-md w-full relative overflow-hidden transform transition-all scale-100 p-8">
            <div className="text-6xl mb-3 filter drop-shadow-md">🏆</div>
            <h2 className="text-3xl font-black text-[#381804] mb-2 font-sans tracking-wide">
              {winner === "TIE" ? "IT'S A TIE!" : `${winner} WINS!`}
            </h2>
            
            <p className="text-[#845a3c] font-bold tracking-wide uppercase text-sm mb-4">
              {gameStatus === "timeup" ? "Time's up!" : `Reached ${TARGET_SCORE} points!`}
            </p>
            
            <div className="bg-[#fff9ee] rounded-2xl p-4 mb-5 border border-[#ecd5bd] shadow-sm flex justify-center items-center gap-8">
               <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-[#381804] uppercase mb-1">{teamA}</span>
                 <span className="text-3xl font-black text-[#d48220]">{scoreA}</span>
               </div>
               <div className="text-[#d8be9e] text-2xl font-light">|</div>
               <div className="flex flex-col items-center">
                 <span className="text-xs font-bold text-[#381804] uppercase mb-1">{teamB}</span>
                 <span className="text-3xl font-black text-[#d48220]">{scoreB}</span>
               </div>
            </div>
            
            {/* Certificate Award section for winners */}
            {(() => {
              const isHumanWinner = mode === "robot" ? (winner === teamA && winner !== "TIE") : (winner && winner !== "TIE");
              const isRobotWinner = mode === "robot" && winner !== teamA && winner !== "TIE";

              return (
                <div className="flex flex-col gap-3">
                  {isHumanWinner && (
                    <button
                      className="mm-pill-btn justify-center w-full py-3.5 shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
                      style={{
                        background: "linear-gradient(180deg, #d48220 0%, #9e5812 100%)",
                        color: "#ffffff",
                        borderColor: "#ffe09a",
                        boxShadow: "0 8px 20px rgba(180, 95, 20, 0.35)",
                      }}
                      onClick={() => setShowCertificate(true)}
                    >
                      <span className="text-xl">📜</span>
                      <span>View & Download Certificate</span>
                    </button>
                  )}

                  {isRobotWinner && (
                    <div className="p-3 rounded-xl bg-[#fff7e6] border border-[#f4c87e] text-xs text-[#704824] font-medium">
                      🤖 Robot won this round! Try again to defeat the robot and earn your certificate.
                    </div>
                  )}

                  <button 
                    className="mm-pill-btn justify-center w-full py-3"
                    style={{
                      background: "linear-gradient(180deg, #3d1a08 0%, #200c03 100%)",
                      color: "#ffdf88",
                      borderColor: "rgba(255, 225, 160, 0.4)",
                    }}
                    onClick={restartGame}
                  >
                    Play Again
                  </button>

                  {onGoHome && (
                    <button 
                      className="mm-pill-btn justify-center w-full py-2.5 bg-[#f8be68]"
                      onClick={onGoHome}
                    >
                      Back To Home
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Official Nebuloid Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        winnerName={winner || teamA}
        difficulty={difficulty}
        mode={mode}
        score={TARGET_SCORE}
      />
    </main>
  );
}

export default MemoryMatchGame;
