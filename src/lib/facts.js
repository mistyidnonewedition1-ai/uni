import { profile } from "../data/profile.js";
import { zones } from "../data/zones.js";

/** Toutes les informations comptées dans la progression. */
export function getFacts(source = profile) {
  const list = [];
  const push = (zone, item) => list.push({ ...item, zone });

  source.tastes.forEach((item) => push("tastes", item));
  source.passions.truths.forEach((item) => push("passions", item));
  source.studies.forEach((item) => push("studies", item));
  source.personality.forEach((item) => push("personality", item));
  source.languages.forEach((item) => push("languages", item));
  push("languages", {
    id: source.languageRiddle.id,
    label: source.languageRiddle.label,
    text: source.languageRiddle.text,
  });
  source.universe.forEach((item) => push("universe", item));
  return list;
}

export function factById(id, source = profile) {
  return getFacts(source).find((fact) => fact.id === id) ?? null;
}

export function factsForZone(zoneId, source = profile) {
  return getFacts(source).filter((fact) => fact.zone === zoneId);
}

export function getStats(discovered, source = profile) {
  const facts = getFacts(source);
  const known = new Set(discovered);
  const found = facts.filter((fact) => known.has(fact.id)).length;
  const zonesDone = zones.filter((zone) => {
    const items = facts.filter((fact) => fact.zone === zone.id);
    return items.length > 0 && items.every((fact) => known.has(fact.id));
  }).length;

  return {
    found,
    total: facts.length,
    zonesDone,
    zonesTotal: zones.length,
    complete: facts.length > 0 && found === facts.length,
  };
}

export function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/** Mélange stable pour ne pas afficher les études dans le bon ordre. */
export function stableShuffle(items) {
  return items
    .map((item, index) => ({
      item,
      rank: [...item.id].reduce((sum, char) => sum + char.charCodeAt(0), index * 17),
    }))
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.item);
}

export function isPassionTruth(id, source = profile) {
  return source.passions.truths.some((item) => item.id === id);
}
