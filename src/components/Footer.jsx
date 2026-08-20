export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/img/logo-blanco-fondo-negro.png"
            alt="OttoLab"
            className="h-9 w-9 flex-none"
          />
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              OttoLab<span className="text-accent">.3d</span>
            </p>
            <p className="mt-1 font-mono text-[12px] text-steel">
              Reconquista, Santa Fe · Impresión bajo pedido
            </p>
          </div>
        </div>

        <div className="flex gap-6 font-mono text-[12px] uppercase tracking-wide text-steel">
          <a
            href="https://wa.me/5490000000000"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/ottolab.3d/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
