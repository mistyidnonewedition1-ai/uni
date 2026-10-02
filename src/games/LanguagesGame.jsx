import { useMemo, useState } from "react";
import { profile } from "../data/profile.js";
import { shuffle } from "../lib/facts.js";
import { useProgress } from "../context/ProgressContext.jsx";

function wordPool() {
  const list = [];
  profile.languages.forEach((language) => {
    language.words.forEach((word, index) => {
      list.push({ key: `${language.id}-${index}`, word, languageId: language.id });
    });
  });
  return list;
}

export function LanguagesGame() {
  const { has, discover, isZoneComplete } = useProgress();
  const words = useMemo(() => shuffle(wordPool()), []);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState(() => {
    const initial = {};
    wordPool().forEach((entry) => {
      if (has(entry.languageId)) initial[entry.key] = entry.languageId;
    });
    return initial;
  });
  const [shake, setShake] = useState(null);
  const [riddleWrong, setRiddleWrong] = useState(false);
  const riddle = profile.languageRiddle;

  function assign(languageId) {
    if (!selected) return;
    const entry = words.find((item) => item.key === selected);
    if (!entry) return;
    if (entry.languageId !== languageId) {
      setShake(selected);
      setTimeout(() => setShake(null), 450);
      return;
    }
    const next = { ...placed, [entry.key]: languageId };
    setPlaced(next);
    setSelected(null);
    const complete = words
      .filter((item) => item.languageId === languageId)
      .every((item) => next[item.key] === languageId);
    if (complete) discover(languageId);
  }

  function solveRiddle(choice) {
    if (choice !== riddle.answer) {
      setRiddleWrong(true);
      return;
    }
    setRiddleWrong(false);
    discover(riddle.id);
  }

  const pool = words.filter((item) => !placed[item.key]);

  return (
    <section className="game game--scroll" data-testid="game-languages">
      <p className="help">Choisis un mot, puis la langue à laquelle il appartient.</p>
      <div className="slips">
        {pool.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`slip ${selected === item.key ? "is-selected" : ""} ${shake === item.key ? "relic--shake" : ""}`}
            data-testid="lang-word"
            onClick={() => setSelected(item.key)}
          >
            {item.word}
          </button>
        ))}
        {pool.length === 0 && <p className="hint">Tous les mots ont trouvé leur langue.</p>}
      </div>
      <div className="bowls">
        {profile.languages.map((language) => {
          const mine = words.filter((item) => placed[item.key] === language.id);
          return (
            <button
              key={language.id}
              type="button"
              className="bowl"
              data-testid={`bowl-${language.id}`}
              onClick={() => assign(language.id)}
            >
              <strong>{language.name}</strong>
              <em>{language.level}</em>
              <span>{mine.map((item) => item.word).join(" · ") || "—"}</span>
            </button>
          );
        })}
      </div>

      <div className={`riddle ${has(riddle.id) ? "riddle--done" : ""}`}>
        <p className="eyebrow">Énigme</p>
        <h2>{riddle.prompt}</h2>
        {has(riddle.id) ? (
          <p>{riddle.text}</p>
        ) : (
          <div className="riddle__choices">
            {riddle.choices.map((choice) => (
              <button key={choice} type="button" className="btn btn--ghost" onClick={() => solveRiddle(choice)}>
                {choice}
              </button>
            ))}
          </div>
        )}
        {riddleWrong && !has(riddle.id) && <p className="hint">Ce n'est pas la bonne piste.</p>}
      </div>
      {isZoneComplete("languages") && <p className="clear-ribbon">Mes langues sont au complet dans le carnet.</p>}
    </section>
  );
}
