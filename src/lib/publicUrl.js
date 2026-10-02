const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export function isLocalHost(value) {
  if (!value) return true;
  try {
    const host = value.includes("://") ? new URL(value).hostname : value;
    return LOCAL_HOSTS.has(host) || host.endsWith(".local");
  } catch {
    return true;
  }
}

function directoryOf(pathname) {
  const clean = pathname.replace(/index\.html$/, "");
  if (clean.endsWith("/")) return clean || "/";
  const slash = clean.lastIndexOf("/");
  return clean.slice(0, slash + 1) || "/";
}

/**
 * URL encodée dans le QR code.
 * Retourne null si la seule adresse connue est locale :
 * le QR final ne doit jamais contenir localhost.
 */
export function resolveShareUrl({ configured, href }) {
  if (configured) {
    const trimmed = String(configured).trim();
    if (!trimmed || isLocalHost(trimmed)) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : null;
    if (!withProtocol) return null;
    const url = new URL(withProtocol);
    if (isLocalHost(url.hostname)) return null;
    if (url.hash && url.hash.length > 1) return url.href;
    const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return `${url.origin}${path}#/`;
  }

  if (!href) return null;
  let current;
  try {
    current = new URL(href);
  } catch {
    return null;
  }
  if (isLocalHost(current.hostname)) return null;
  const directory = directoryOf(current.pathname);
  return `${current.origin}${directory}#/`;
}
