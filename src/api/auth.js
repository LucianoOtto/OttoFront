import client from "./client";

export async function login(email, password) {
  // Axios convierte automáticamente { email, password } a JSON
  const response = await client.post("/auth/login", { email, password });
  return response.data;
}

export async function me(token) {
  const response = await client.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}