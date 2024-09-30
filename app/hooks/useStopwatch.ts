import { useCallback, useEffect, useRef, useState } from "react";

const useStopwatch = () => {
  const time = useRef(0);
  const prevTime_sec = useRef(0);

  const isRunning = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const [_time, setTime] = useState(0);

  const start = useCallback((init?: number) => {
    if (!isRunning.current) {
      isRunning.current = true;
      if (init) time.current = init;
      // @ts-expect-error
      intervalRef.current = setInterval(() => {
        prevTime_sec.current = Math.round(time.current);
        time.current = parseFloat((time.current + 0.1).toFixed(1));

        if (prevTime_sec.current !== Math.round(time.current)) {
          setTime(Math.round(time.current));
        }
      }, 100);
    }
  }, []);

  const stop = useCallback(() => {
    isRunning.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      prevTime_sec.current = 0;
      setTime(0);
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

  return { time, start, stop, reset, restart, _time };
};

export default useStopwatch;
