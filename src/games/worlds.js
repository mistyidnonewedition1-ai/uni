/**
 * Emplacements des jeux d'exploration.
 * Les TEXTES sont dans profile.js. Ici, seulement la géométrie.
 * Si tu ajoutes un 6e, 7e ou 8e objet dans profile.js, il prend
 * automatiquement l'emplacement supplémentaire. Au-delà, ajoute un slot.
 */

export const tasteWorld = {
  id: "tastes",
  w: 300,
  h: 420,
  start: { x: 150, y: 250 },
  obstacles: [
    { id: "plant", kind: "plant", x: 14, y: 14, w: 48, h: 48 },
    { id: "shelf", kind: "shelf", x: 198, y: 16, w: 86, h: 112 },
    { id: "table", kind: "table", x: 128, y: 168, w: 72, h: 48 },
    { id: "sofa", kind: "sofa", x: 16, y: 292, w: 132, h: 72 },
  ],
  decor: [
    { id: "rug", kind: "rug", x: 78, y: 228, w: 140, h: 46 },
    { id: "lamp", kind: "lamp", x: 230, y: 250, w: 28, h: 28 },
  ],
  slots: [
    { x: 250, y: 180 },
    { x: 42, y: 230 },
    { x: 150, y: 64 },
    { x: 250, y: 370 },
    { x: 48, y: 384 },
    { x: 160, y: 390 },
    { x: 40, y: 100 },
    { x: 230, y: 300 },
  ],
};

export const universeWorld = {
  id: "universe",
  w: 900,
  h: 600,
  start: { x: 430, y: 150 },
  floors: [
    { id: "dream", name: "Zone rêveuse", tint: "dream", x: 0, y: 0, w: 300, h: 300 },
    { id: "music", name: "Zone musicale", tint: "music", x: 316, y: 0, w: 284, h: 300 },
    { id: "games", name: "Zone jeux vidéo", tint: "games", x: 616, y: 0, w: 284, h: 300 },
    { id: "create", name: "Zone créative", tint: "create", x: 0, y: 316, w: 450, h: 284 },
    { id: "es", name: "Zone espagnole", tint: "es", x: 466, y: 316, w: 434, h: 284 },
  ],
  obstacles: [
    { id: "w1", kind: "wall", x: 300, y: 0, w: 16, h: 100 },
    { id: "w2", kind: "wall", x: 300, y: 180, w: 16, h: 120 },
    { id: "w3", kind: "wall", x: 600, y: 0, w: 16, h: 100 },
    { id: "w4", kind: "wall", x: 600, y: 180, w: 16, h: 120 },
    { id: "h1", kind: "wall", x: 0, y: 300, w: 60, h: 16 },
    { id: "h2", kind: "wall", x: 150, y: 300, w: 210, h: 16 },
    { id: "h3", kind: "wall", x: 440, y: 300, w: 460, h: 16 },
    { id: "v1", kind: "wall", x: 450, y: 316, w: 16, h: 84 },
    { id: "v2", kind: "wall", x: 450, y: 480, w: 16, h: 120 },
    { id: "tree", kind: "plant", x: 36, y: 150, w: 36, h: 36 },
    { id: "speaker", kind: "shelf", x: 500, y: 200, w: 44, h: 36 },
    { id: "arcade", kind: "table", x: 700, y: 190, w: 70, h: 40 },
    { id: "desk", kind: "table", x: 200, y: 470, w: 90, h: 40 },
    { id: "bench", kind: "sofa", x: 700, y: 500, w: 90, h: 36 },
  ],
  decor: [],
  slots: [
    { x: 80, y: 70 },
    { x: 170, y: 210 },
    { x: 460, y: 70 },
    { x: 760, y: 80 },
    { x: 110, y: 430 },
    { x: 700, y: 420 },
    { x: 250, y: 80 },
    { x: 780, y: 250 },
  ],
};

export function bindPickups(items, world) {
  return items.slice(0, world.slots.length).map((item, index) => ({
    id: item.id,
    icon: item.icon || "✦",
    label: item.label,
    zoneName: item.zoneName || "",
    x: world.slots[index].x,
    y: world.slots[index].y,
  }));
}
