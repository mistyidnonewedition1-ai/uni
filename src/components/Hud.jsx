import { useNavigate, useLocation } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";

export function Hud() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, setNotebookOpen } = useProgress();
  const atHub = location.pathname === "/";
  const ratio = stats.total ? Math.round((stats.found / stats.total) * 100) : 0;

  return (
    <header className="hud">
      {atHub ? (
        <button type="button" className="hud__icon" onClick={() => navigate("/partager")}>
          QR
        </button>
      ) : (
        <button type="button" className="hud__icon" onClick={() => navigate("/")} aria-label="Retour au ciel">
          ←
        </button>
      )}

      <div className="hud__meter">
        <p data-testid="progress-count">
          <strong>{stats.found}</strong>/{stats.total}
          <span> · {stats.zonesDone}/{stats.zonesTotal} jeux</span>
        </p>
        <div
          className="meter"
          role="progressbar"
          aria-valuenow={stats.found}
          aria-valuemin={0}
          aria-valuemax={stats.total}
          aria-label="Informations découvertes"
        >
          <span style={{ width: `${ratio}%` }} />
        </div>
      </div>

      <button
        type="button"
        className="hud__book"
        data-testid="notebook-open"
        onClick={() => setNotebookOpen(true)}
      >
        Carnet
      </button>
    </header>
  );
}
