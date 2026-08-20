import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";

export default function Navbar() {
  const { categories } = useCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/img/logo-blanco-fondo-negro.png"
            alt="OttoLab"
            className="h-10 w-10 flex-none"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            OttoLab<span className="text-accent">.3d</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`/#${c.slug}`}
              className="font-mono text-[13px] uppercase tracking-wide text-steel transition-colors hover:text-ink"
            >
              {c.name}
            </a>
          ))}
        </nav>

        <Link
          to="/contacto"
          className="rounded-full bg-ink px-4 py-2 font-mono text-[13px] text-paper transition-colors hover:bg-accent"
        >
          Escribinos
        </Link>
      </div>
    </header>
  );
}
