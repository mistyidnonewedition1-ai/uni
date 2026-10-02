import { useMemo, useState } from "react";
import { profile } from "../data/profile.js";
import { shuffle } from "../lib/facts.js";
import { useProgress } from "../context/ProgressContext.jsx";

export function PassionsGame() {
  const { has, discover, isZoneComplete } = useProgress();
  const deck = useMemo(() => {
    const cards = [
      ...profile.passions.truths.map((item) => ({ ...item, truth: true })),
      ...profile.passions.decoys.map((item) => ({ ...item, truth: false })),
    ];
    return shuffle(cards);
  }, []);
  const [rejected, setRejected] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [message, setMessage] = useState("");

  const remaining = deck.filter((card) => (card.truth ? !has(card.id) : !rejected.includes(card.id)));
  const card = remaining[0];

  function answer(saysTruth) {
    if (!card) return;
    const correct = saysTruth === card.truth;
    if (!correct) {
      setWrong(true);
      setMessage(card.truth ? "Si, celle-ci fait partie de moi." : "Non, ça ne me ressemble pas.");
      return;
    }
    setWrong(false);
    setMessage("");
    if (card.truth) discover(card.id);
    else setRejected((current) => [...current, card.id]);
  }

  return (
    <section className="game game--scroll" data-testid="game-passions">
      <p className="help">Certaines cartes sont moi. D'autres sont des leurres. Trie-les.</p>
      <p className="countline">
        Passions trouvées : {profile.passions.truths.filter((item) => has(item.id)).length}/
        {profile.passions.truths.length}
      </p>
      {card ? (
        <div className={`relic ${wrong ? "relic--shake" : ""}`} data-testid="passion-card">
          <span className="relic__icon">{card.icon}</span>
          <h2>{card.label}</h2>
          {message && <p className="hint">{message}</p>}
          <div className="pair">
            <button type="button" className="btn btn--wide" data-testid="passion-yes" onClick={() => answer(true)}>
              C'est une passion
            </button>
            <button type="button" className="btn btn--ghost btn--wide" data-testid="passion-no" onClick={() => answer(false)}>
              Ce n'est pas moi
            </button>
          </div>
        </div>
      ) : (
        <div className="relic">
          <h2>Collection complète</h2>
          <p>Tu as séparé ce qui m'anime de ce qui ne me ressemble pas.</p>
        </div>
      )}
      {isZoneComplete("passions") && <p className="clear-ribbon">Mes passions sont au complet dans le carnet.</p>}
    </section>
  );
}
