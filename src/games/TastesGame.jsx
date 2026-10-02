import { profile } from "../data/profile.js";
import { bindPickups, tasteWorld } from "./worlds.js";
import { ExploreWorld } from "../components/ExploreWorld.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

export function TastesGame() {
  const { discovered, discover, isZoneComplete } = useProgress();
  const pickups = bindPickups(profile.tastes, tasteWorld);

  return (
    <section className="game" data-testid="game-tastes">
      <p className="help">Explore la pièce. Approche-toi de ce qui brille, puis ramasse-le.</p>
      {profile.tastes.length > tasteWorld.slots.length && (
        <p className="hint">Trop d'objets pour les cachettes prévues. Maximum {tasteWorld.slots.length}.</p>
      )}
      <ExploreWorld
        world={tasteWorld}
        pickups={pickups}
        discovered={discovered}
        onCollect={discover}
        secret
        speed={132}
      />
      {isZoneComplete("tastes") && <p className="clear-ribbon">Mes goûts sont au complet dans le carnet.</p>}
    </section>
  );
}
