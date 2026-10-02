import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";
import { zones } from "../data/zones.js";
import { factsForZone } from "../lib/facts.js";

export function Finale({ onExplore, onReplay }) {
  const [armed, setArmed] = useState(false);

  return (
    <div className="finale" data-testid="finale">
      <div className="finale__stars" aria-hidden="true">
        {zones.map((zone) => (
          <span key={zone.id}>{zone.icon}</span>
        ))}
      </div>
      <p className="eyebrow">Fin du voyage</p>
      <h1>Tu connais maintenant mon univers.</h1>
      <p className="finale__lead">Tu as découvert tout mon univers.</p>

      <article className="portrait">
        <header>
          <h2>{profile.name}</h2>
          <p>{profile.age}</p>
          <p className="tagline">{profile.tagline}</p>
        </header>
        {profile.portrait.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {zones.map((zone) => (
          <section key={zone.id}>
            <h3>
              {zone.icon} {zone.title}
            </h3>
            <ul>
              {factsForZone(zone.id).map((fact) => (
                <li key={fact.id}>
                  <strong>{fact.label}.</strong> {fact.text}
                </li>
              ))}
            </ul>
            {zone.id === "personality" && <p className="synthesis">{profile.personalitySynthesis}</p>}
          </section>
        ))}
      </article>

      <div className="finale__actions">
        <button type="button" className="btn btn--wide" onClick={() => (armed ? onReplay() : setArmed(true))}>
          {armed ? "Confirmer : tout effacer" : "Rejouer"}
        </button>
        <button type="button" className="btn btn--ghost btn--wide" onClick={onExplore}>
          Explorer à nouveau
        </button>
        <Link className="finale__qr" to="/partager">
          QR code
        </Link>
      </div>
    </div>
  );
}
