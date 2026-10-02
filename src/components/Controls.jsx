import { useEffect, useRef } from "react";

export function Joystick({ inputRef }) {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const pointer = useRef(null);

  function moveKnob(x, y) {
    const travel = 28;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${x * travel}px, ${y * travel}px)`;
    }
  }

  function fromEvent(event) {
    const rect = baseRef.current.getBoundingClientRect();
    let x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    let y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const magnitude = Math.hypot(x, y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }
    inputRef.current.jx = x;
    inputRef.current.jy = y;
    inputRef.current.joy = true;
    moveKnob(x, y);
  }

  function release() {
    pointer.current = null;
    inputRef.current.jx = 0;
    inputRef.current.jy = 0;
    inputRef.current.joy = false;
    moveKnob(0, 0);
  }

  return (
    <div
      className="joy touch-only"
      ref={baseRef}
      data-testid="joystick"
      role="slider"
      aria-label="Joystick de déplacement"
      aria-valuemin={-1}
      aria-valuemax={1}
      aria-valuetext="Déplace le personnage"
      onPointerDown={(event) => {
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        fromEvent(event);
      }}
      onPointerMove={(event) => {
        if (pointer.current !== event.pointerId) return;
        fromEvent(event);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span className="joy__knob" ref={knobRef} />
    </div>
  );
}

export function Dpad({ onMove }) {
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  function hold(dx, dy) {
    onMove(dx, dy);
    clearInterval(timer.current);
    timer.current = setInterval(() => onMove(dx, dy), 170);
  }

  function stop() {
    clearInterval(timer.current);
  }

  const buttons = [
    ["Haut", 0, -1, "up"],
    ["Gauche", -1, 0, "left"],
    ["Bas", 0, 1, "down"],
    ["Droite", 1, 0, "right"],
  ];

  return (
    <div className="dpad touch-only" data-testid="dpad">
      {buttons.map(([label, dx, dy, place]) => (
        <button
          key={place}
          type="button"
          className={`dpad__btn dpad__btn--${place}`}
          aria-label={label}
          onPointerDown={(event) => {
            event.preventDefault();
            hold(dx, dy);
          }}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
        >
          {place === "up" ? "↑" : place === "down" ? "↓" : place === "left" ? "←" : "→"}
        </button>
      ))}
    </div>
  );
}
