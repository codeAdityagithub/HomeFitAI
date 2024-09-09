import { useRef, useEffect, useCallback } from "react";

const useStopwatch = () => {
  const time = useRef(0);
  const isRunning = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback((init?: number) => {
    if (!isRunning.current) {
      isRunning.current = true;
      if (init) time.current = init;
      // @ts-expect-error
      intervalRef.current = setInterval(() => {
        time.current = parseFloat((time.current + 0.1).toFixed(1));
      }, 100);
    }
  }, []);

  const stop = useCallback(() => {
    isRunning.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    time.current = 0;
  }, [stop]);

  const restart = useCallback(() => {
    reset();
    start();
  }, [reset, start]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { time: time, start, stop, reset, restart };
};

export default useStopwatch;
