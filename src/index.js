import React, { useRef, useCallback } from "react";
import cx from "classnames";
import ReactDOM from "react-dom";
import useMouse from "./useMouse";
import useTrack from "./useTrack";

import "./styles.css";

const TestMouseTrack = () => {
  const elem = useRef();
  const [hovered, pos] = useMouse(elem);
  let { x: targetX = 0, y: targetY = 0 } = pos || {};
  if (!hovered) {
    targetX = 0;
    targetY = 0;
  }
  const translate = useCallback(([x, y]) => {
    if (!elem.current) return;
    elem.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);
  useTrack([0, 0], [targetX / 2, targetY / 2], 0.1, translate);
  return (
    <div className="circle" ref={elem}>
      Hello
    </div>
  );
};

const map = (v, start1, end1, start2, end2) => {
  return start2 + ((v - start1) / (end1 - start1)) * (end2 - start2);
};

const Tilt = () => {
  const card = useRef();
  const [hovered, pos] = useMouse(card);
  const { pctX = 0, pctY = 0 } = pos;
  const rotY = hovered ? map(pctX, -1, 1, 15, -15) : 0;
  const rotX = hovered ? map(pctY, -1, 1, -15, 15) : 0;
  const animate = useCallback(([rotX, rotY]) => {
    if (card.current) {
      card.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  }, []);
  useTrack([0, 0], [rotX, rotY], 0.1, animate);
  return (
    <div ref={card} className="card-wrapper">
      <div className="card-inner">Tilt</div>
    </div>
  );
};

const TrackButton = () => {
  const elem = useRef();
  const [hovered, pos] = useMouse(elem);
  let { x: targetX = 0, y: targetY = 0 } = pos;
  if (!hovered) {
    targetX = 0;
    targetY = 0;
  }
  const translate = useCallback(([x, y, x2, y2]) => {
    if (!elem.current) return;
    const icon = elem.current.querySelector(".btn-icon");
    const border = elem.current.querySelector(".btn-border-wrapper");
    border.style.transform = `translate(${x}px, ${y}px)`;
    icon.style.transform = `translate(${x2}px, ${y2}px)`;
  }, []);
  useTrack(
    [0, 0, 0, 0],
    [targetX / 2, targetY / 2, targetX / 1.4, targetY / 1.4],
    0.1,
    translate
  );
  return (
    <button
      ref={elem}
      className={cx("btn", "magnetic-btn", { "-active": hovered })}
    >
      <div className="magnetic-btn-inner">
        <div className="btn-border-wrapper">
          <svg className="btn-border" viewBox="0 0 46.5 45.5">
            <path d="M44.533,26.132 L39.391,37.308 L28.893,43.949 L16.374,43.946 L5.806,37.301 L0.546,26.122 L2.264,13.960 L10.414,4.676 L22.408,1.216 L34.439,4.681 L42.687,13.969 L44.533,26.132 Z" />
          </svg>
        </div>
        <div className="btn-content">
          <svg className="btn-icon" viewBox="0 0 10 10" width="20" height="20">
            <path
              strokeLinecap="round"
              fillRule="evenodd"
              d="M7.828,9.243 L5.000,6.414 L2.172,9.243 L0.757,7.828 L3.586,5.000 L0.757,2.172 L2.172,0.757 L5.000,3.586 L7.828,0.757 L9.243,2.172 L6.414,5.000 L9.243,7.828 L7.828,9.243 Z"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div className="demos">
        <TestMouseTrack />
        <Tilt />
        <TrackButton />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
