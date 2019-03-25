import { useEffect, useState, useRef } from "react";

const useMouse = elemRef => {
  const boundsRect = useRef();
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
    pctX: 0,
    pctY: 0,
    rawX: 0,
    rawY: 0
  });
  const guardVar = elemRef ? elemRef.current : null;

  const setMousePos = e => {
    const { clientX, clientY } = e;
    const { top, left, width, height } = boundsRect.current;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const centerX = left + halfWidth;
    const centerY = top + halfHeight;
    const diffX = clientX - centerX;
    const diffY = clientY - centerY;
    const pos = {
      x: diffX,
      y: diffY,
      pctX: diffX / halfWidth,
      pctY: diffY / halfHeight,
      rawX: clientX,
      rawY: clientY
    };
    setPos(pos);
  };

  useEffect(
    () => {
      if (!elemRef || !elemRef.current) return;
      const elem = elemRef.current;

      const onMouseEnter = e => {
        boundsRect.current = elem.getBoundingClientRect();
        setHovered(true);
        setMousePos(e);

        elem.addEventListener("mousemove", onMouseMove, false);
        elem.addEventListener("mouseleave", onMouseLeave, false);
      };

      const onMouseMove = e => {
        setMousePos(e);
      };

      const onMouseLeave = e => {
        setHovered(false);
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onMouseLeave);
      };

      elem.addEventListener("mouseenter", onMouseEnter, false);

      return () => {
        elem.removeEventListener("mouseenter", onMouseEnter);
        hovered && elem.removeEventListener("mousemove", onMouseMove);
        hovered && elem.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    [guardVar]
  );

  return [hovered, pos];
};

export default useMouse;
