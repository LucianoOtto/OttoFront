import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">
        Error 404
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Esta pieza no existe
      </h1>
      <p className="mt-3 font-body text-steel">
        La página que buscás no la tenemos en el catálogo.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block font-mono text-[12px] text-accent underline underline-offset-2 hover:text-ink"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}