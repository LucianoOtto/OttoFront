import request from "./client";
import { useAuthStore } from "../store/authStore";

function token() {
  return useAuthStore.getState().token;
}

// Público: cualquiera completa el formulario del catálogo
export function submitContact(data) {
  return request("/contact", { method: "POST", body: data });
}

// Admin: bandeja de mensajes recibidos
export function getMessages(status) {
  const query = status ? `?status=${status}` : "";
  return request(`/contact${query}`, { token: token() });
}

export function updateMessageStatus(id, status) {
  return request(`/contact/${id}/status`, {
    method: "PATCH",
    body: { status },
    token: token(),
  });
}