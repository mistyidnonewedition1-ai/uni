import { profile } from "../data/profile.js";
import { bindPickups, universeWorld } from "./worlds.js";
import { ExploreWorld } from "../components/ExploreWorld.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

export function UniverseGame() {
  const { discovered, discover, isZoneComplete } = useProgress();
  const pickups = bindPickups(profile.universe, universeWorld);

  return (
    <section className="game" data-testid="game-universe">
      <p className="help">Marche d'une zone à l'autre. Ramasse ce qui t'appelle.</p>
      {profile.universe.length > universeWorld.slots.length && (
        <p className="hint">Trop de découvertes pour la carte. Maximum {universeWorld.slots.length}.</p>
      )}
      <ExploreWorld
        world={universeWorld}
        pickups={pickups}
        discovered={discovered}
        onCollect={discover}
        speed={176}
      />
      {isZoneComplete("universe") && <p className="clear-ribbon">Mon univers est au complet dans le carnet.</p>}
    </section>
  );
}
