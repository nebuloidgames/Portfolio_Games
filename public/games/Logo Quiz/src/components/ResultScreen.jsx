import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, CheckCircle, XCircle, Zap, Target, Lightbulb, SlidersHorizontal, Users, Bot, User, Award, Crown } from 'lucide-react';
import { calculateAccuracy, getRankTier, DIFFICULTY_POINTS, getMaxPossibleScore } from '../utils/scoring';

/**
 * Ultra-Modern Minimalist Monochrome Result Screen Dashboard
 */
export default function ResultScreen({
  score = 0,
  correctCount = 0,
  wrongCount = 0,
  totalQuestions = 10,
  hintsUsedCount = 0,
  bestScore = 0,
  isNewBest = false,
  difficulty = 'easy',
  gameMode = 'self', // 'self' | 'team' | 'robot'
  teamScores = { team1: 0, team2: 0 },
  robotScore = 0,
  userScore = 0,
  playerNames = {
    team1: "Team 1",
    team2: "Team 2",
    player: "Player 1",
    robot: "Robo AI",
  },
  onPlayAgain,
  onChangeMode,
  onChangeDifficulty,
  onBackToHome,
}) {
  const accuracy = calculateAccuracy(correctCount, totalQuestions);
  const rank = getRankTier(accuracy);
  const ptsPerQuestion = DIFFICULTY_POINTS[difficulty.toLowerCase()] || 10;
  const maxPossibleScore = getMaxPossibleScore(difficulty, totalQuestions);

  // Determine winner for Team and Robot modes
  const isTeam1Winner = teamScores.team1 >= 10 || (teamScores.team1 > teamScores.team2 && teamScores.team1 >= 10);
  const isTeam2Winner = teamScores.team2 >= 10 || (teamScores.team2 > teamScores.team1 && teamScores.team2 >= 10);
  const isUserWinner = userScore >= 10 || (userScore > robotScore && userScore >= 10);
  const isRobotWinner = robotScore >= 10 || (robotScore > userScore && robotScore >= 10);

  // Trigger celebratory confetti for high score or winning
  useEffect(() => {
    const shouldCelebrate =
      (gameMode === 'self' && accuracy >= 50) ||
      (gameMode === 'team') ||
      (gameMode === 'robot' && isUserWinner);

    if (shouldCelebrate) {
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#000000', '#6366F1', '#10B981', '#F59E0B'],
        });
      } catch {}
    }
  }, [accuracy, gameMode, isUserWinner]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[90vh] animate-pop relative z-10">
      {/* 1. SELF MODE: High Score Banner */}
      {gameMode === 'self' && isNewBest && (
        <div className="mb-4 px-4 py-1.5 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest flex items-center gap-1.5 border-2 border-black animate-bounce shadow-md">
          <Trophy className="w-4 h-4 text-amber-400" />
          New Personal High Score!
        </div>
      )}

      {/* Main Card */}
      <div className="w-full bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* ================= MODE 1: SELF MODE VIEW ================= */}
        {gameMode === 'self' && (
          <>
            {/* Tier Ranking Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">{rank.icon}</div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
                {rank.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {rank.subtitle}
              </p>
            </div>

            {/* Scoreboard Highlight */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-black mb-5 flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-black" />
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  {difficulty.toUpperCase()} • {ptsPerQuestion} pts/Q
                </span>
              </div>
              <span className="text-sm font-black text-black font-mono">
                {correctCount} / {totalQuestions} Correct
              </span>
            </div>

            {/* Score & Accuracy Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-black text-center flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Total Score
                </span>
                <span className="text-3xl sm:text-4xl font-black text-black font-mono mt-1">
                  {score.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Max: {maxPossibleScore} pts
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-black text-center flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Accuracy
                </span>
                <span className="text-3xl sm:text-4xl font-black text-black font-mono mt-1">
                  {accuracy}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {correctCount} Right • {wrongCount} Wrong
                </span>
              </div>
            </div>
          </>
        )}

        {/* ================= MODE 2: TEAM VS TEAM VIEW ================= */}
        {gameMode === 'team' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-black">
                <Crown className="w-9 h-9 text-amber-400 animate-bounce" />
              </div>
              <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
                Team vs Team Duel Over
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-1">
                {isTeam1Winner
                  ? `${playerNames?.team1 || 'Team 1'} Wins!`
                  : isTeam2Winner
                    ? `${playerNames?.team2 || 'Team 2'} Wins!`
                    : 'Match Tied!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                First team to achieve 10 score goal.
              </p>
            </div>

            {/* Scorecard Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className={`p-4 rounded-2xl border-2 border-black text-center flex flex-col items-center justify-center ${
                  isTeam1Winner ? 'bg-indigo-50/80 ring-4 ring-indigo-500/20' : 'bg-slate-50 opacity-80'
                }`}
              >
                <span className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1 truncate max-w-[140px]">
                  {playerNames?.team1 || 'Team 1'} (Blue)
                </span>
                <span className="text-3xl sm:text-4xl font-black text-indigo-700 font-mono mt-1">
                  {teamScores.team1}
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-600 mt-0.5">
                  {isTeam1Winner ? '🏆 Winner' : 'Runner Up'}
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 border-black text-center flex flex-col items-center justify-center ${
                  isTeam2Winner ? 'bg-rose-50/80 ring-4 ring-rose-500/20' : 'bg-slate-50 opacity-80'
                }`}
              >
                <span className="text-xs font-black text-rose-950 uppercase flex items-center gap-1 truncate max-w-[140px]">
                  {playerNames?.team2 || 'Team 2'} (Red)
                </span>
                <span className="text-3xl sm:text-4xl font-black text-rose-700 font-mono mt-1">
                  {teamScores.team2}
                </span>
                <span className="text-[10px] font-black uppercase text-rose-600 mt-0.5">
                  {isTeam2Winner ? '🏆 Winner' : 'Runner Up'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ================= MODE 3: VS ROBOT VIEW ================= */}
        {gameMode === 'robot' && (
          <>
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-black ${
                  isUserWinner ? 'bg-black text-amber-400' : 'bg-purple-900 text-white'
                }`}
              >
                {isUserWinner ? (
                  <Crown className="w-9 h-9 animate-bounce text-amber-400" />
                ) : (
                  <Bot className="w-9 h-9 text-purple-300 animate-pulse" />
                )}
              </div>
              <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
                vs Robot Battle Over
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-1">
                {isUserWinner
                  ? `${playerNames?.player || 'You'} Defeated ${playerNames?.robot || 'The Robot'}!`
                  : isRobotWinner
                    ? `${playerNames?.robot || 'Robot AI'} Wins The Race!`
                    : 'Duel Completed!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {isUserWinner
                  ? 'Outstanding quick reflexes and brand recognition!'
                  : `${playerNames?.robot || 'The Robot AI'} achieved 10 points first. Try again!`}
              </p>
            </div>

            {/* Scorecard Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className={`p-4 rounded-2xl border-2 border-black text-center flex flex-col items-center justify-center ${
                  isUserWinner ? 'bg-indigo-50/80 ring-4 ring-indigo-500/20' : 'bg-slate-50 opacity-80'
                }`}
              >
                <span className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1 truncate max-w-[140px]">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  {playerNames?.player || 'Your'} Score
                </span>
                <span className="text-3xl sm:text-4xl font-black text-indigo-700 font-mono mt-1">
                  {userScore}
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-600 mt-0.5">
                  {isUserWinner ? '🏆 Victory' : 'Defeat'}
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 border-black text-center flex flex-col items-center justify-center ${
                  isRobotWinner ? 'bg-purple-50/80 ring-4 ring-purple-500/20' : 'bg-slate-50 opacity-80'
                }`}
              >
                <span className="text-xs font-black text-purple-950 uppercase flex items-center gap-1 truncate max-w-[140px]">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  {playerNames?.robot || 'Robot'} Score
                </span>
                <span className="text-3xl sm:text-4xl font-black text-purple-700 font-mono mt-1">
                  {robotScore}
                </span>
                <span className="text-[10px] font-black uppercase text-purple-600 mt-0.5">
                  {isRobotWinner ? '🤖 AI Winner' : 'Runner Up'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-slate-900 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer border-2 border-black"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onChangeMode}
              type="button"
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Change Mode</span>
            </button>

            <button
              onClick={onChangeDifficulty}
              type="button"
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Difficulty</span>
            </button>
          </div>

          <button
            onClick={onBackToHome}
            type="button"
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer mt-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
