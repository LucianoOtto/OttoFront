import request from "./client";
import { useAuthStore } from "../store/authStore";

function token() {
  return useAuthStore.getState().token;
}

export function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();

  return request(`/products${query ? `?${query}` : ""}`, { token: token() });
}

export function getProduct(id) {
  return request(`/products/${id}`, { token: token() });
}

export function createProduct(data) {
  return request("/products", { method: "POST", body: data, token: token() });
}

// Nota: MakerWorld bloquea el scraping desde servidores (Cloudflare), así
// que esto no se usa desde la UI por ahora — la importación real se hace
// con el bookmarklet en AdminProducts.jsx. Se deja por si en el futuro se
// resuelve el bloqueo (ej: servicio de scraping con navegador headless).
export function importFromMakerworld(url) {
  return request("/products/import-preview", {
    method: "POST",
    body: { url },
    token: token(),
  });
}

// Descarga una imagen externa (ej: la que trae el bookmarklet de
// MakerWorld) y la guarda en nuestro propio servidor, para no depender de
// que el link externo siga vivo (hotlinking).
export function downloadProductImage(imageUrl) {
  return request("/products/download-image", {
    method: "POST",
    body: { image_url: imageUrl },
    token: token(),
  });
}

export function updateProduct(id, data) {
  return request(`/products/${id}`, { method: "PUT", body: data, token: token() });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE", token: token() });
}