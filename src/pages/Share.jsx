import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { resolveShareUrl } from "../lib/publicUrl.js";

export function SharePage() {
  const auto = resolveShareUrl({
    configured: import.meta.env.VITE_PUBLIC_URL || "",
    href: window.location.href,
  });
  const [manual, setManual] = useState("");
  const typed = manual.trim()
    ? resolveShareUrl({ configured: manual.trim(), href: window.location.href })
    : null;
  const url = typed || auto;
  const [image, setImage] = useState("");
  const [copied, setCopied] = useState(false);
  const rejectedLocal = manual.trim() && !typed;

  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setImage("");
      return undefined;
    }
    QRCode.toDataURL(url, {
      margin: 1,
      width: 560,
      color: { dark: "#141226", light: "#f4ecdf" },
    }).then((data) => {
      if (!cancelled) setImage(data);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="share" data-testid="share">
      <p className="eyebrow">Pour l'exposé</p>
      <h1>Partager mon univers</h1>
      <p className="share__lead">
        Montre ce QR code au public. Chacun l'ouvre sur son téléphone et joue, sans installer d'application.
      </p>

      {url && image ? (
        <figure className="qr">
          <img src={image} alt="QR code vers le site" data-testid="share-qr" />
          <figcaption>{url}</figcaption>
        </figure>
      ) : (
        <div className="qr qr--empty" data-testid="share-empty">
          <p>Le QR code n'utilise jamais une adresse localhost.</p>
          <p>Mets le site en ligne, ouvre-le depuis son URL publique, ou colle cette URL ci-dessous.</p>
        </div>
      )}

      <label className="field">
        URL publique
        <input
          value={manual}
          onChange={(event) => setManual(event.target.value)}
          placeholder="https://mon-univers.vercel.app"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          data-testid="share-input"
        />
      </label>
      {rejectedLocal && <p className="hint">Cette adresse est locale. Le QR code ne l'affichera pas.</p>}

      {url && (
        <button type="button" className="btn btn--wide" onClick={copy}>
          {copied ? "URL copiée" : "Copier l'URL"}
        </button>
      )}
    </div>
  );
}
