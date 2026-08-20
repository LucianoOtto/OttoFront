import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const price = Number(product.price);

  return (
    <article className="group border border-line bg-white transition-colors hover:border-ink">
      <div className="aspect-square overflow-hidden border-b border-line bg-paper">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover grayscale-[15%] transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-wide text-steel">
            sin imagen
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category_name && (
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-steel">
            {product.category_name}
          </p>
        )}
        <h3 className="font-display text-[15px] font-medium leading-tight">
          {product.name}
        </h3>
        {product.designer_name && (
          <p className="mt-0.5 font-mono text-[11px] text-steel">
            Diseño de {product.designer_name}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">
            ${price.toLocaleString("es-AR")}
          </p>
          <Link
            to={`/contacto?producto=${product.id}`}
            className="font-mono text-[12px] text-accent underline underline-offset-2 hover:text-ink"
          >
            Consultar
          </Link>
        </div>
      </div>
    </article>
  );
}
