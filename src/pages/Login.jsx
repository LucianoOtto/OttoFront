import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  if (token) {
    const from = location.state?.from || "/admin/productos";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      setAuth(data);
      navigate("/admin/productos");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="print-bed flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-white p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/img/logo-blanco-fondo-negro.png"
            alt="OttoLab"
            className="h-10 w-10 flex-none"
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Panel
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              OttoLab<span className="text-accent">.3d</span>
            </h1>
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-line px-4 py-3 font-body outline-none focus:border-accent"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
            Contraseña
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-line px-4 py-3 font-body outline-none focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-mono text-[13px] text-paper transition-colors hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}