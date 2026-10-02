export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" data-testid="toast" key={toast.token}>
      <span aria-hidden="true">✦</span>
      <p>
        <span>Découverte</span>
        <strong>{toast.label}</strong>
      </p>
    </div>
  );
}
