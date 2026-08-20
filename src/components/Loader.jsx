export default function Loader({ label = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="font-mono text-[12px] uppercase tracking-widest text-steel">{label}</p>
    </div>
  );
}