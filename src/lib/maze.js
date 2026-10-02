/** Labyrinthe. # mur, . sol, S départ, X sortie, A-F symboles. */
export const MAZE_ROWS = [
  "#############",
  "#S..#.....F.#",
  "#.#.#.#####.#",
  "#.#...#...#.#",
  "#.###.#.#.#.#",
  "#A..#.#.#...#",
  "###.#.#.###B#",
  "#...#.#.....#",
  "#.#.#.#####.#",
  "#.#...#...C.#",
  "#.###.#.#.#.#",
  "#D....#.#...#",
  "#.#####.###.#",
  "#.......#X..#",
  "#############",
];

export function parseMaze(rows = MAZE_ROWS) {
  const grid = rows.map((row) => row.split(""));
  let start = null;
  let exit = null;
  const anchors = [];

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === "S") start = { c, r };
      else if (cell === "X") exit = { c, r };
      else if (/[A-F]/.test(cell)) anchors.push({ ch: cell, c, r });
    });
  });

  anchors.sort((a, b) => a.ch.localeCompare(b.ch));

  return { grid, start, exit, anchors, cols: grid[0].length, rows: grid.length };
}

export function cellOpen(grid, c, r) {
  return Boolean(grid[r] && grid[r][c] && grid[r][c] !== "#");
}

/** Tous les symboles et la sortie sont-ils accessibles depuis le départ ? */
export function mazeTargetsReachable(rows = MAZE_ROWS) {
  const { grid, start, exit, anchors } = parseMaze(rows);
  const seen = new Set([`${start.c},${start.r}`]);
  const queue = [start];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const current = queue.shift();
    for (const [dc, dr] of dirs) {
      const c = current.c + dc;
      const r = current.r + dr;
      if (!cellOpen(grid, c, r)) continue;
      const key = `${c},${r}`;
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ c, r });
    }
  }

  const targets = [...anchors, { ch: "X", ...exit }];
  return targets.map((target) => ({
    ch: target.ch,
    ok: seen.has(`${target.c},${target.r}`),
  }));
}
