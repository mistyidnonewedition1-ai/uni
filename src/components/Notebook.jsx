import { profile } from "../data/profile.js";
import { factsForZone, stableShuffle } from "../lib/facts.js";
import { useProgress } from "../context/ProgressContext.jsx";

function rowsFor(zoneId, has) {
  const items = factsForZone(zoneId);
  if (zoneId === "studies" && !items.every((item) => has(item.id))) {
    return stableShuffle(items);
  }
  return items;
}

export function Notebook() {
  const { notebookOpen, setNotebookOpen, has, zones, isZoneComplete, stats } = useProgress();
  if (!notebookOpen) return null;

  return (
    <div className="sheet" role="presentation" onClick={() => setNotebookOpen(false)}>
      <div
        className="note"
        data-testid="notebook"
        role="dialog"
        aria-modal="true"
        aria-label="Carnet"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="note__head">
          <div>
            <p className="eyebrow">Carnet</p>
            <h2>{profile.name}</h2>
            <p className="note__age">{profile.age}</p>
          </div>
          <button type="button" className="hud__icon" onClick={() => setNotebookOpen(false)} aria-label="Fermer le carnet">
            ✕
          </button>
        </header>
        <p className="note__count">
          {stats.found} / {stats.total} informations
        </p>
        <div className="note__body">
          {zones.map((zone) => {
            const items = rowsFor(zone.id, has);
            const done = isZoneComplete(zone.id);
            return (
              <section key={zone.id} className="note__zone">
                <h3>
                  <span>{zone.icon}</span>
                  {zone.title}
                  {done && <em>✓</em>}
                </h3>
                <ul>
                  {items.map((item) => {
                    const known = has(item.id);
                    const showLabel = known || zone.id !== "passions";
                    return (
                      <li key={item.id} className={known ? "known" : "unknown"}>
                        <span className="mark">{known ? "✓" : "?"}</span>
                        <div>
                          <strong>{showLabel ? item.label : "Passion à identifier"}</strong>
                          {known && <p>{item.text}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {zone.id === "personality" && done && (
                  <p className="synthesis">{profile.personalitySynthesis}</p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
