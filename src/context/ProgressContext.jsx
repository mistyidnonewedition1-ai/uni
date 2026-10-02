import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data/profile.js";
import { zones } from "../data/zones.js";
import { factById, factsForZone, getFacts, getStats } from "../lib/facts.js";

const STORAGE_KEY = "mon-univers-carnet-v1";
const ProgressContext = createContext(null);

function loadDiscovered() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveDiscovered(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* navigation privée : la partie reste en mémoire */
  }
}

export function ProgressProvider({ children }) {
  const [discovered, setDiscovered] = useState(loadDiscovered);
  const [toast, setToast] = useState(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const discoveredRef = useRef(discovered);
  discoveredRef.current = discovered;

  const facts = useMemo(() => getFacts(profile), []);

  const stats = useMemo(() => getStats(discovered, profile), [discovered]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2300);
    return () => clearTimeout(timer);
  }, [toast]);

  const has = useCallback((id) => discovered.includes(id), [discovered]);

  const discover = useCallback((id) => {
    const fact = factById(id, profile);
    if (!fact || discoveredRef.current.includes(id)) return false;
    const next = [...discoveredRef.current, id];
    discoveredRef.current = next;
    saveDiscovered(next);
    setDiscovered(next);
    setToast({ id, label: fact.label, token: Date.now() });
    return true;
  }, []);

  const reset = useCallback(() => {
    setDiscovered([]);
    setToast(null);
    setNotebookOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const isZoneComplete = useCallback(
    (zoneId) => {
      const items = factsForZone(zoneId, profile);
      return items.length > 0 && items.every((item) => discovered.includes(item.id));
    },
    [discovered],
  );

  const value = {
    discovered,
    facts,
    zones,
    stats,
    toast,
    notebookOpen,
    setNotebookOpen,
    has,
    discover,
    reset,
    isZoneComplete,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress doit être utilisé dans ProgressProvider");
  return ctx;
}
