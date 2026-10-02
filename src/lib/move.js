export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function circleHitsRect(cx, cy, radius, rect) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.w);
  const nearestY = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy < radius * radius;
}

/**
 * Déplace un cercle sans traverser les rectangles.
 * dx et dy sont appliqués séparément pour glisser le long des murs.
 */
export function moveCircle(pos, dx, dy, radius, obstacles, bounds) {
  let x = clamp(pos.x + dx, bounds.x + radius, bounds.x + bounds.w - radius);
  let y = pos.y;

  for (const obstacle of obstacles) {
    if (circleHitsRect(x, y, radius, obstacle)) {
      x = dx > 0 ? Math.min(x, obstacle.x - radius) : Math.max(x, obstacle.x + obstacle.w + radius);
    }
  }
  x = clamp(x, bounds.x + radius, bounds.x + bounds.w - radius);

  y = clamp(pos.y + dy, bounds.y + radius, bounds.y + bounds.h - radius);
  for (const obstacle of obstacles) {
    if (circleHitsRect(x, y, radius, obstacle)) {
      y = dy > 0 ? Math.min(y, obstacle.y - radius) : Math.max(y, obstacle.y + obstacle.h + radius);
    }
  }
  y = clamp(y, bounds.y + radius, bounds.y + bounds.h - radius);

  return { x, y };
}

export function cameraOffset(view, world, player) {
  if (world <= view) return (view - world) / 2;
  return clamp(view / 2 - player, view - world, 0);
}

/** BFS sur une grille : chaque cible est-elle joignable à pied ? */
export function reachable(world, start, goals, radius = 12, step = 4) {
  const { w, h, obstacles } = world;
  const blocked = (x, y) => {
    if (x < radius || y < radius || x > w - radius || y > h - radius) return true;
    return obstacles.some((obstacle) => circleHitsRect(x, y, radius - 1, obstacle));
  };

  const cols = Math.ceil(w / step);
  const rows = Math.ceil(h / step);
  const key = (c, r) => c + r * (cols + 2);
  const startC = Math.round(start.x / step);
  const startR = Math.round(start.y / step);
  const queue = [[startC, startR]];
  const seen = new Set([key(startC, startR)]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const [c, r] = queue.shift();
    for (const [dc, dr] of dirs) {
      const nc = c + dc;
      const nr = r + dr;
      if (nc < 0 || nr < 0 || nc > cols || nr > rows) continue;
      const nextKey = key(nc, nr);
      if (seen.has(nextKey)) continue;
      if (blocked(nc * step, nr * step)) continue;
      seen.add(nextKey);
      queue.push([nc, nr]);
    }
  }

  return goals.map((goal) => ({
    id: goal.id,
    ok: seen.has(key(Math.round(goal.x / step), Math.round(goal.y / step))),
  }));
}
