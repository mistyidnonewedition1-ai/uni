import { useEffect, useRef, useState } from "react";
import { cameraOffset, moveCircle } from "../lib/move.js";
import { Joystick } from "./Controls.jsx";

function createInput() {
  return { kx: 0, ky: 0, jx: 0, jy: 0, joy: false, interact: false };
}

export function ExploreWorld({ world, pickups, discovered, onCollect, secret = false, speed = 148 }) {
  const viewRef = useRef(null);
  const worldRef = useRef(null);
  const avatarRef = useRef(null);
  const inputRef = useRef(createInput());
  const posRef = useRef({ ...world.start });
  const keysRef = useRef(new Set());
  const collectRef = useRef(onCollect);
  const discoveredRef = useRef(discovered);
  const pickupsRef = useRef(pickups);
  const nearRef = useRef(null);
  const zoneRef = useRef("");
  const pingRef = useRef(false);
  const [nearId, setNearId] = useState(null);
  const [zoneName, setZoneName] = useState("");
  const [ping, setPing] = useState(false);
  const [hint, setHint] = useState("");

  collectRef.current = onCollect;
  discoveredRef.current = discovered;
  pickupsRef.current = pickups;
  pingRef.current = ping;

  useEffect(() => {
    const input = inputRef.current;
    const keys = keysRef.current;

    function syncKeys() {
      let x = 0;
      let y = 0;
      if (keys.has("arrowleft") || keys.has("q") || keys.has("a")) x -= 1;
      if (keys.has("arrowright") || keys.has("d")) x += 1;
      if (keys.has("arrowup") || keys.has("z") || keys.has("w")) y -= 1;
      if (keys.has("arrowdown") || keys.has("s")) y += 1;
      const magnitude = Math.hypot(x, y);
      input.kx = magnitude ? x / magnitude : 0;
      input.ky = magnitude ? y / magnitude : 0;
    }

    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", "arrowdown", " "].includes(key)) {
        event.preventDefault();
      }
      if (key === " " || key === "enter") {
        if (!event.repeat) input.interact = true;
        return;
      }
      keys.add(key);
      syncKeys();
    }

    function onKeyUp(event) {
      keys.delete(event.key.toLowerCase());
      syncKeys();
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    const radius = secret ? 12 : 14;
    const bounds = { x: 0, y: 0, w: world.w, h: world.h };
    let frame = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const vx = (input.joy ? input.jx : input.kx) * speed;
      const vy = (input.joy ? input.jy : input.ky) * speed;

      if (!document.hidden && (vx || vy)) {
        posRef.current = moveCircle(posRef.current, vx * dt, vy * dt, radius, world.obstacles, bounds);
      }

      const point = posRef.current;
      const view = viewRef.current;
      const worldEl = worldRef.current;
      const avatar = avatarRef.current;

      if (view && worldEl && avatar) {
        const viewW = view.clientWidth;
        const viewH = view.clientHeight;
        if (secret) {
          const scale = Math.min(viewW / world.w, viewH / world.h);
          const offsetX = (viewW - world.w * scale) / 2;
          const offsetY = (viewH - world.h * scale) / 2;
          worldEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        } else {
          const camX = cameraOffset(viewW, world.w, point.x);
          const camY = cameraOffset(viewH, world.h, point.y);
          worldEl.style.transform = `translate(${camX}px, ${camY}px)`;
        }
        avatar.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        avatar.dataset.x = String(Math.round(point.x));
        avatar.dataset.y = String(Math.round(point.y));

        const known = new Set(discoveredRef.current);
        let best = null;
        let bestDistance = secret ? 46 : 54;
        for (const item of pickupsRef.current) {
          const el = worldEl.querySelector(`[data-pickup="${item.id}"]`);
          const distance = Math.hypot(item.x - point.x, item.y - point.y);
          if (el) {
            el.classList.toggle("pickup--warm", !known.has(item.id) && distance < (secret ? 92 : 78));
            el.classList.toggle("pickup--got", known.has(item.id));
            el.classList.toggle("pickup--ping", pingRef.current && !known.has(item.id));
          }
          if (!known.has(item.id) && distance < bestDistance) {
            best = item;
            bestDistance = distance;
          }
        }

        if (world.floors) {
          const floor = world.floors.find(
            (area) =>
              point.x >= area.x &&
              point.x <= area.x + area.w &&
              point.y >= area.y &&
              point.y <= area.y + area.h,
          );
          const name = floor?.name || "";
          if (name !== zoneRef.current) {
            zoneRef.current = name;
            setZoneName(name);
          }
        }

        const nextNear = best?.id ?? null;
        if (nextNear !== nearRef.current) {
          nearRef.current = nextNear;
          setNearId(nextNear);
        }

        if (input.interact) {
          input.interact = false;
          if (best) collectRef.current(best.id);
          else setHint("Rien à ramasser ici.");
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      keys.clear();
      input.kx = 0;
      input.ky = 0;
    };
  }, [secret, speed, world]);

  useEffect(() => {
    if (!hint) return undefined;
    const timer = setTimeout(() => setHint(""), 1100);
    return () => clearTimeout(timer);
  }, [hint]);

  const nearItem = pickups.find((item) => item.id === nearId);

  return (
    <div className="explore">
      <div className={`viewport ${secret ? "viewport--room" : "viewport--world"}`} ref={viewRef}>
        <div
          className="world"
          ref={worldRef}
          style={{ width: world.w, height: world.h }}
          data-testid="world"
        >
          {world.floors?.map((floor) => (
            <div
              key={floor.id}
              className={`floor floor--${floor.tint}`}
              style={{ left: floor.x, top: floor.y, width: floor.w, height: floor.h }}
            >
              <span>{floor.name}</span>
            </div>
          ))}
          {world.decor?.map((item) => (
            <div
              key={item.id}
              className={`decor decor--${item.kind}`}
              style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
            />
          ))}
          {world.obstacles.map((item) => (
            <div
              key={item.id}
              className={`block block--${item.kind || "wall"}`}
              style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
            />
          ))}
          {pickups.map((item) => {
            const found = discovered.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                data-pickup={item.id}
                className={`pickup ${secret && !found ? "pickup--secret" : ""} ${found ? "pickup--got" : ""}`}
                style={{ left: item.x, top: item.y }}
                aria-label={found ? `${item.label} déjà trouvé` : "Élément à découvrir"}
                onClick={() => {
                  const distance = Math.hypot(item.x - posRef.current.x, item.y - posRef.current.y);
                  const reach = secret ? 46 : 54;
                  if (distance <= reach) onCollect(item.id);
                  else setHint("Approche-toi encore un peu.");
                }}
              >
                <span>{found ? "✓" : item.icon}</span>
              </button>
            );
          })}
          <div className="avatar" ref={avatarRef} data-testid="avatar" />
        </div>
        <div className="vignette" />
        {zoneName && <p className="zone-chip">{zoneName}</p>}
      </div>

      <div className="controls">
        <Joystick inputRef={inputRef} />
        <div className="controls__mid">
          <p className="keys-hint">Flèches ou ZQSD · Espace pour ramasser</p>
          {hint && <p className="hint">{hint}</p>}
          {nearItem && !hint && <p className="hint">Quelque chose est tout près.</p>}
          {secret && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setPing(true);
                setTimeout(() => setPing(false), 1600);
              }}
            >
              Chercher
            </button>
          )}
        </div>
        <button
          type="button"
          className="act"
          data-testid="collect"
          disabled={!nearId}
          onPointerDown={(event) => {
            event.preventDefault();
            inputRef.current.interact = true;
          }}
        >
          Ramasser
        </button>
      </div>
    </div>
  );
}
