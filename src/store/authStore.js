import { create } from "zustand";
import { persist } from "zustand/middleware";

// Guarda el token/usuario admin logueado. Se persiste en localStorage
// para no tener que volver a loguearse en cada visita al panel.
export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => Boolean(get().token),
    }),
    { name: "admin-auth" }
  )
);