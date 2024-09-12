import { useCallback, useEffect, useRef } from "react";

const useLongPress = ({ callback }: { callback: () => void }) => {
  const callbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCallback = useCallback(() => {
    if (callbackIntervalRef.current !== null) return;
    callbackIntervalRef.current = setInterval(() => {
      callback();
    }, 150); // Decrease every 100ms
  }, [callback]);

  const stopCallback = useCallback(() => {
    if (callbackIntervalRef.current !== null) {
      clearInterval(callbackIntervalRef.current);
      callbackIntervalRef.current = null;
    }
  }, []);
  // useEffect(() => {
  //   return () => {
  //     stopCallback();
  //   };
  // }, [stopCallback]);

  return {
    onClick: callback,
    onMouseDown: startCallback,
    onMouseUp: stopCallback,
    onMouseLeave: stopCallback,
    onTouchStart: startCallback,
    onTouchEnd: stopCallback,
  };
};
export default useLongPress;
