import { useRef } from "react";
import usePrevious from "./usePrevious";

const useValuesMemoized = (values, equalFn = (x1, x2) => x1 === x2) => {
  const prevValues = usePrevious(values);
  const flagRef = useRef(0);
  values = Array.isArray(values) ? values : [values];
  const hasChanged =
    prevValues !== undefined &&
    (values.length !== prevValues.length ||
      values.some((v, i) => !equalFn(v, prevValues[i])));
  if (hasChanged) flagRef.current++;
  return flagRef.current;
};

export default useValuesMemoized;
