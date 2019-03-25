import { useRef, useCallback, useEffect, useState } from "react";
import useValuesMemoized from "./useValuesMemoized";
import useRaf from "./useRaf";

const track = (s, t, k) => {
  return s + (t - s) * k;
};

const almostEqual = (a, b) => {
  return Math.abs(a - b) <= 0.00001;
};

const useTrack = (curVal, targetVal, step = 0.1, callback) => {
  const [tracking, setTracking] = useState(false);
  const curChanged = useValuesMemoized(curVal);
  const targetChanged = useValuesMemoized(targetVal);
  const curRef = useRef();
  const targetRef = useRef();
  const hasCallback = typeof callback === "function";

  // change curRef only when current values change
  // because we always set new tracking values to curRef in the raf
  useEffect(
    () => {
      curRef.current = curVal;
    },
    [curChanged]
  );

  targetRef.current = targetVal;

  useEffect(
    () => {
      if (!tracking) setTracking(true);
    },
    [curChanged, targetChanged]
  );

  const rafCallback = useCallback(
    () => {
      if (hasCallback) {
        const targetValues = targetRef.current;
        const newValues = curRef.current.map((v, i) => {
          let newVal = track(v, targetValues[i], step);
          if (almostEqual(newVal, targetValues[i])) {
            newVal = targetValues[i];
          }
          return newVal;
        });
        curRef.current = newValues;
        callback(newValues);
        if (newValues.every((v, i) => v === targetValues[i])) {
          setTracking(false);
        }
      }
    },
    [callback]
  );
  useRaf(rafCallback, !hasCallback || !tracking);
};

export default useTrack;
