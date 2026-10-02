/**
 * Structure du ciel (le menu).
 * Les TEXTES personnels sont dans profile.js.
 * Tu peux renommer un titre ici si tu veux changer le nom d'une étoile.
 * `locked: true` affiche un cadenas et empêche d'entrer.
 * Pour l'exposé, laisse tout ouvert : le public choisit par où commencer.
 */

export const zones = [
  {
    id: "universe",
    path: "/univers",
    icon: "✨",
    title: "Mon univers", // À PERSONNALISER si tu veux un autre nom
    blurb: "Explore librement cinq zones.",
    x: 50,
    y: 11,
    locked: false,
  },
  {
    id: "tastes",
    path: "/gouts",
    icon: "🎵",
    title: "Mes goûts",
    blurb: "Trouve les objets cachés dans la pièce.",
    x: 22,
    y: 31,
    locked: false,
  },
  {
    id: "passions",
    path: "/passions",
    icon: "🎮",
    title: "Mes passions",
    blurb: "Garde ce qui est vraiment moi.",
    x: 78,
    y: 31,
    locked: false,
  },
  {
    id: "studies",
    path: "/etudes",
    icon: "🎬",
    title: "Mes études",
    blurb: "Remets mon parcours dans l'ordre.",
    x: 22,
    y: 69,
    locked: false,
  },
  {
    id: "personality",
    path: "/personnalite",
    icon: "🧠",
    title: "Personnalité",
    blurb: "Traverse le labyrinthe.",
    x: 78,
    y: 69,
    locked: false,
  },
  {
    id: "languages",
    path: "/langues",
    icon: "🌎",
    title: "Mes langues",
    blurb: "Associe chaque mot à sa langue.",
    x: 50,
    y: 89,
    locked: false,
  },
];

export const homeNode = { x: 50, y: 50 };
