import { trendingProducts } from "../data/products";

export default function TrendingStrip() {
  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Lo más pedido
          </h2>
          <span className="font-mono text-[12px] text-steel">
            {trendingProducts.length} modelos en cola
          </span>
        </div>

        <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
          {trendingProducts.map((p) => (
            <article
              key={p.id}
              className="w-64 flex-none border border-line bg-white"
            >
              <div className="aspect-square overflow-hidden border-b border-line">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-[15px] font-medium leading-tight">
                  {p.name}
                </h3>
                <p className="mt-3 font-display text-lg font-semibold">
                  ${p.price.toLocaleString("es-AR")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}