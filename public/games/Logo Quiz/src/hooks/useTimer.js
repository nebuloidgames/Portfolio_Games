import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ initialSeconds = 15, onTimeout, onTick, warningThreshold = 5 }) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Store latest callbacks in refs to avoid interval churn & stale closures
  const onTimeoutRef = useRef(onTimeout);
  const onTickRef = useRef(onTick);
  const timerIdRef = useRef(null);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onTickRef.current = onTick;
  }, [onTimeout, onTick]);

  // Main countdown tick effect
  useEffect(() => {
    if (!isRunning) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      return;
    }

    timerIdRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
          setIsRunning(false);
          if (onTimeoutRef.current) {
            onTimeoutRef.current();
          }
          return 0;
        }

        const nextTime = prev - 1;
        if (onTickRef.current) {
          onTickRef.current(nextTime);
        }
        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (seconds = initialSeconds) => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      setIsRunning(false);
      setTimeRemaining(seconds);
    },
    [initialSeconds]
  );

  const isWarning = isRunning && timeRemaining > 0 && timeRemaining <= warningThreshold;

  return {
    timeRemaining,
    isRunning,
    isWarning,
    start,
    pause,
    reset,
    setTimeRemaining,
  };
}
