import { useEffect, useMemo, useState } from "react";
import { profile } from "../data/profile.js";
import { cellOpen, parseMaze } from "../lib/maze.js";
import { useProgress } from "../context/ProgressContext.jsx";
import { Dpad } from "../components/Controls.jsx";

export function PersonalityGame() {
  const maze = useMemo(() => parseMaze(), []);
  const symbols = useMemo(
    () =>
      maze.anchors.slice(0, profile.personality.length).map((anchor, index) => ({
        ...anchor,
        ...profile.personality[index],
      })),
    [maze],
  );
  const { has, discover } = useProgress();
  const [pos, setPos] = useState(maze.start);
  const [hint, setHint] = useState("");
  const [showEnd, setShowEnd] = useState(false);
  const found = profile.personality.filter((item) => has(item.id)).length;

  useEffect(() => {
    const symbol = symbols.find((item) => item.c === pos.c && item.r === pos.r);
    if (symbol) discover(symbol.id);
    if (pos.c === maze.exit.c && pos.r === maze.exit.r) {
      const ready = profile.personality.every((item) => item.id === symbol?.id || has(item.id));
      if (ready) setShowEnd(true);
      else setHint("Il reste des symboles dans le labyrinthe.");
    }
  }, [pos, symbols, maze.exit, discover, has]);

  function tryMove(dx, dy) {
    if (showEnd) return;
    setPos((current) => {
      const c = current.c + dx;
      const r = current.r + dy;
      if (!cellOpen(maze.grid, c, r)) return current;
      setHint("");
      return { c, r };
    });
  }

  useEffect(() => {
    function onKey(event) {
      const key = event.key.toLowerCase();
      const map = {
        arrowup: [0, -1],
        arrowdown: [0, 1],
        arrowleft: [-1, 0],
        arrowright: [1, 0],
        z: [0, -1],
        w: [0, -1],
        s: [0, 1],
        q: [-1, 0],
        a: [-1, 0],
        d: [1, 0],
      };
      if (!map[key]) return;
      event.preventDefault();
      if (event.repeat) return;
      tryMove(...map[key]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="game" data-testid="game-personality">
      <p className="help">Traverse le labyrinthe et touche chaque symbole. La sortie s'ouvre à la fin.</p>
      <p className="countline">
        Symboles {found}/{profile.personality.length}
      </p>
      {profile.personality.length > maze.anchors.length && (
        <p className="hint">Maximum {maze.anchors.length} traits pour ce labyrinthe.</p>
      )}
      <div
        className="maze"
        data-testid="maze"
        style={{ gridTemplateColumns: `repeat(${maze.cols}, 1fr)` }}
      >
        {maze.grid.map((row, r) =>
          row.map((cell, c) => {
            const symbol = symbols.find((item) => item.c === c && item.r === r);
            const known = symbol && has(symbol.id);
            const isExit = maze.exit.c === c && maze.exit.r === r;
            return (
              <div
                key={`${c}-${r}`}
                className={`cell ${cell === "#" ? "cell--wall" : "cell--path"} ${isExit ? "cell--exit" : ""} ${isExit && found === profile.personality.length ? "cell--open" : ""}`}
              >
                {pos.c === c && pos.r === r && <span className="pawn" data-testid="pawn" />}
                {symbol && <span className={`glyph ${known ? "glyph--got" : ""}`}>{known ? "✓" : symbol.symbol}</span>}
                {isExit && !symbol && <span className="glyph">✶</span>}
              </div>
            );
          }),
        )}
      </div>
      {hint && <p className="hint">{hint}</p>}
      <div className="controls controls--maze">
        <Dpad onMove={tryMove} />
        <p className="keys-hint">Flèches ou ZQSD pour avancer</p>
      </div>
      {showEnd && (
        <div className="synthesis-card" data-testid="synthesis">
          <p className="eyebrow">Synthèse</p>
          <h2>Ma personnalité</h2>
          <p>{profile.personalitySynthesis}</p>
        </div>
      )}
    </section>
  );
}
