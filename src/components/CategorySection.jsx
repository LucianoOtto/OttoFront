import ProductCard from "./ProductCard";

export default function CategorySection({ category, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section id={category.slug} className="scroll-mt-20 border-b border-line py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-1 border-l-2 border-accent pl-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {category.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}