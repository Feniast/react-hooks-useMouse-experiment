import { useRef, useEffect } from "react";

const useRaf = (callback: Function, stop = false) => {
  const frameRef = useRef(null);
  const callbackRef = useRef();

  useEffect(
    () => {
      callbackRef.current = callback;
    },
    [callback]
  );

  useEffect(
    () => {
      function tick() {
        frameRef.current = requestAnimationFrame(tick);
        callbackRef.current && callbackRef.current();
      }

      if (stop !== true) {
        frameRef.current = requestAnimationFrame(tick);
        return () => {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
          }
        };
      }
    },
    [stop]
  );
};

export default useRaf;
