import { useEffect, useState } from "react";
import { profile } from "../data/profile.js";
import { shuffle } from "../lib/facts.js";
import { useProgress } from "../context/ProgressContext.jsx";

function freshOrder() {
  const ids = profile.studies.map((item) => item.id);
  if (ids.length < 2) return ids;
  let next = shuffle(ids);
  let guard = 0;
  while (next.every((id, index) => id === ids[index]) && guard < 10) {
    next = shuffle(ids);
    guard += 1;
  }
  return next;
}

export function StudiesGame() {
  const { has, discover, isZoneComplete } = useProgress();
  const already = profile.studies.every((item) => has(item.id));
  const [order, setOrder] = useState(freshOrder);
  const [solved, setSolved] = useState(already);
  const [wrong, setWrong] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!solved) return undefined;
    const timers = profile.studies.map((item, index) =>
      setTimeout(() => discover(item.id), 500 * index),
    );
    return () => timers.forEach(clearTimeout);
  }, [solved, discover]);

  useEffect(() => {
    function onKey(event) {
      if (solved) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        move(selected, -1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        move(selected, 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setSelected(target);
    setWrong(false);
  }

  function validate() {
    const correct = profile.studies.map((item) => item.id);
    const ok = order.every((id, index) => id === correct[index]);
    setWrong(!ok);
    if (ok) setSolved(true);
  }

  if (solved || already) {
    return (
      <section className="game game--scroll" data-testid="game-studies">
        <p className="help">Le parcours est remis dans l'ordre.</p>
        <ol className="timeline">
          {profile.studies.map((item, index) => (
            <li key={item.id} style={{ animationDelay: `${index * 0.12}s` }}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="game game--scroll" data-testid="game-studies">
      <p className="help">Remets les étapes de mon parcours dans le bon ordre, de la plus ancienne à la plus récente.</p>
      <ul className="film">
        {order.map((id, index) => {
          const item = profile.studies.find((entry) => entry.id === id);
          return (
            <li key={id} className={selected === index ? "is-selected" : ""}>
              <button type="button" className="film__label" onClick={() => setSelected(index)}>
                <span>{index + 1}</span>
                {item.label}
              </button>
              <div className="film__moves">
                <button type="button" aria-label={`Monter ${item.label}`} onClick={() => move(index, -1)}>
                  ↑
                </button>
                <button type="button" aria-label={`Descendre ${item.label}`} onClick={() => move(index, 1)}>
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {wrong && <p className="hint">L'ordre du parcours n'est pas encore le bon.</p>}
      <button type="button" className="btn btn--wide" data-testid="study-validate" onClick={validate}>
        Valider l'ordre
      </button>
      {isZoneComplete("studies") && <p className="clear-ribbon">Mes études sont au complet dans le carnet.</p>}
    </section>
  );
}
