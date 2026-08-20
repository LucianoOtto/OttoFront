const API_URL = import.meta.env.VITE_API_URL 

export default async function request(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuestas sin body (ej: 204 No Content)
  }

  if (!res.ok) {
    throw new Error(data?.error || "Ocurrió un error inesperado. Probá de nuevo.");
  }

  return data;
}