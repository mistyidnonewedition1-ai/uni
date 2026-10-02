import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";
import { Hud } from "./Hud.jsx";
import { Notebook } from "./Notebook.jsx";
import { Toast } from "./Toast.jsx";
import { Finale } from "../pages/Finale.jsx";

export function Shell({ children }) {
  const { stats, toast, reset } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const skipFinale = useRef(false);
  const onFinale = location.pathname === "/final";

  useEffect(() => {
    if (!stats.complete || skipFinale.current) return;
    if (location.pathname === "/final" || location.pathname === "/partager") return;
    navigate("/final");
  }, [stats.complete, location.pathname, navigate]);

  function exploreAgain() {
    skipFinale.current = true;
    navigate("/");
  }

  function replay() {
    skipFinale.current = false;
    reset();
    navigate("/");
  }

  return (
    <div className="app">
      <div className="sky" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      {!onFinale && <Hud />}
      <Toast toast={toast} />
      <main className="stage">
        {onFinale ? (
          stats.complete ? (
            <Finale onExplore={exploreAgain} onReplay={replay} />
          ) : (
            <div className="share">
              <h1>Pas encore.</h1>
              <p className="share__lead">L'auto-portrait s'ouvre quand toutes les informations sont dans le carnet.</p>
            </div>
          )
        ) : (
          children
        )}
      </main>
      <Notebook />
      <div className="turn">
        <p>Tourne ton téléphone en portrait pour jouer.</p>
      </div>
    </div>
  );
}
