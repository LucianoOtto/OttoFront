export default function Hero() {
  return (
    <section className="print-bed-dark relative overflow-hidden border-b border-line">
      {/* pasada del cabezal, cruzando la escena de arriba a abajo */}
      <div className="print-head" aria-hidden="true" />

      {/* marcas de origen y capa, como el readout de una impresora */}
      <div className="absolute left-6 top-6 font-mono text-[11px] text-paper/40">
        ⌂ 0,0
      </div>
      <div className="absolute right-6 top-6 font-mono text-[11px] text-paper/40">
        Z 0.20mm
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-32">
        <p className="mb-4 font-mono text-[13px] uppercase tracking-widest text-mist">
          Impresión 3D bajo pedido
        </p>

        <h1 className="print-reveal font-display text-5xl font-semibold leading-[1.05] tracking-tight text-paper md:text-7xl">
          <span>Lo que imaginás,</span>
          <span>capa</span>
          <span>
            por capa se <span className="text-mist">vuelve real</span>.
          </span>
        </h1>

        <p className="mt-6 max-w-md font-body text-paper/60">
          Catálogo de piezas listas para pedir y diseños a medida. Elegí un
          modelo o contanos qué necesitás.
        </p>
      </div>
    </section>
  );
}