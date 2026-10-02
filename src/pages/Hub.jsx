import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";
import { homeNode } from "../data/zones.js";
import { useProgress } from "../context/ProgressContext.jsx";

const badges = { open: "🌟", done: "✓", locked: "🔒" };

export function Hub() {
  const { zones, isZoneComplete, stats } = useProgress();
  const [notice, setNotice] = useState("");

  return (
    <div className="hub" data-testid="hub">
      <header className="hub__title">
        <p className="eyebrow">Auto-portrait</p>
        <h1>L'univers de {profile.name}</h1>
        <p className="tagline">{profile.tagline}</p>
      </header>

      <div className="atlas" data-testid="atlas">
        <svg className="atlas__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {zones.map((zone) => (
            <line
              key={zone.id}
              x1={homeNode.x}
              y1={homeNode.y}
              x2={zone.x}
              y2={zone.y}
              className={isZoneComplete(zone.id) ? "line--done" : "line--open"}
            />
          ))}
        </svg>

        <div className="node node--home" style={{ left: `${homeNode.x}%`, top: `${homeNode.y}%` }}>
          <div className="node__orb">
            <span>🏠</span>
          </div>
          <span className="node__name">Départ</span>
        </div>

        {zones.map((zone) => {
          const status = zone.locked ? "locked" : isZoneComplete(zone.id) ? "done" : "open";
          const content = (
            <>
              <span className="node__badge" aria-hidden="true">{badges[status]}</span>
              <span className="node__orb">{zone.icon}</span>
              <span className="node__name">{zone.title}</span>
            </>
          );

          if (status === "locked") {
            return (
              <button
                key={zone.id}
                type="button"
                className={`node node--${status}`}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                onClick={() => setNotice("Cette étoile est encore fermée.")}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={zone.id}
              to={zone.path}
              className={`node node--${status}`}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              data-testid={`node-${zone.id}`}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <p className="hub__help">{notice || profile.intro}</p>
      {!profile.ready && <p className="flag">Textes d'exemple — personnalise src/data/profile.js</p>}
      {stats.complete && (
        <Link className="btn btn--wide" to="/final">
          Voir l'auto-portrait
        </Link>
      )}
    </div>
  );
}
