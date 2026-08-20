export default function RecentStrip({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Recién agregado
          </h2>
          <span className="font-mono text-[12px] text-steel">
            {products.length} modelos
          </span>
        </div>

        <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
          {products.map((p) => (
            <article
              key={p.id}
              className="group w-64 flex-none border border-line bg-white transition-colors hover:border-ink"
            >
              <div className="aspect-square overflow-hidden border-b border-line">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover grayscale-[15%] transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-wide text-steel">
                    sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-[15px] font-medium leading-tight">
                  {p.name}
                </h3>
                <p className="mt-3 font-display text-lg font-semibold">
                  ${Number(p.price).toLocaleString("es-AR")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}