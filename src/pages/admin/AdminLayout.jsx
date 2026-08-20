import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `font-mono text-[13px] uppercase tracking-wide transition-colors ${
      isActive ? "text-accent" : "text-steel hover:text-ink"
    }`;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/img/logo-blanco-fondo-negro.png"
              alt="OttoLab"
              className="h-9 w-9 flex-none"
            />
            <span className="font-display text-lg font-semibold tracking-tight">
              OttoLab<span className="text-accent">.3d</span>
              <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-widest text-steel">
                / panel
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/admin/productos" className={linkClass}>
              Productos
            </NavLink>
            <NavLink to="/admin/categorias" className={linkClass}>
              Categorías
            </NavLink>
            <NavLink to="/admin/secciones" className={linkClass}>
              Secciones
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="hidden font-mono text-[12px] text-steel sm:inline">
                {user.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-full border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-wide transition-colors hover:border-accent hover:text-accent"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
