export default function EmptyState({ title, description, action }) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">
        ⌂ 0,0
      </p>
      <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
      {description && <p className="mt-2 font-body text-steel">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}