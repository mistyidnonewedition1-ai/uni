import { profile } from "../src/data/profile.js";
import { getFacts, getStats, isPassionTruth } from "../src/lib/facts.js";
import { mazeTargetsReachable } from "../src/lib/maze.js";
import { moveCircle, reachable } from "../src/lib/move.js";
import { resolveShareUrl, isLocalHost } from "../src/lib/publicUrl.js";
import { bindPickups, tasteWorld, universeWorld } from "../src/games/worlds.js";

const failures = [];
function check(name, condition) {
  if (!condition) failures.push(name);
  else console.log("ok", name);
}

const facts = getFacts();
const ids = facts.map((fact) => fact.id);
check("30 informations", facts.length === 30);
check("ids uniques", new Set(ids).size === ids.length);
check("énigme valide", profile.languageRiddle.choices.includes(profile.languageRiddle.answer));

for (const zone of ["tastes", "passions", "studies", "personality", "languages", "universe"]) {
  check(`zone ${zone}`, facts.some((fact) => fact.zone === zone));
}

check("stats vides", getStats([]).found === 0 && getStats([]).complete === false);
check("stats pleines", getStats(ids).complete === true && getStats(ids).zonesDone === 6);
check("passion vraie", isPassionTruth("passion-cinema"));
check("leurre exclu", !isPassionTruth("decoy-rugby"));

const tasteGoals = bindPickups(profile.tastes, tasteWorld);
const universeGoals = bindPickups(profile.universe, universeWorld);
check(
  "pièce joignable",
  reachable(tasteWorld, tasteWorld.start, tasteGoals, 12, 4).every((goal) => goal.ok),
);
check(
  "univers joignable",
  reachable(universeWorld, universeWorld.start, universeGoals, 14, 4).every((goal) => goal.ok),
);
check(
  "labyrinthe joignable",
  mazeTargetsReachable().every((target) => target.ok),
);

const stuck = moveCircle({ x: 150, y: 50 }, 120, 0, 12, tasteWorld.obstacles, {
  x: 0,
  y: 0,
  w: tasteWorld.w,
  h: tasteWorld.h,
});
check("collision meuble", stuck.x <= 186);

check("localhost refusé", resolveShareUrl({ configured: "", href: "http://localhost:5173/" }) === null);
check("127.0.0.1 refusé", resolveShareUrl({ configured: "http://127.0.0.1:5173", href: "" }) === null);
check(
  "url publique",
  resolveShareUrl({ configured: "https://mon-univers.vercel.app", href: "http://localhost:5173/" }) ===
    "https://mon-univers.vercel.app/#/",
);
check(
  "github pages",
  resolveShareUrl({ configured: "", href: "https://user.github.io/spirt/index.html" }) ===
    "https://user.github.io/spirt/#/",
);
check("hôte local", isLocalHost("localhost") === true);

if (failures.length) {
  console.error("ÉCHECS", failures);
  process.exit(1);
}
console.log("Tous les contrôles sont passés.");
