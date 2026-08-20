import client from "./client";

export async function getSections() {
  const response = await client.get("/sections");
  return response.data;
}

export async function createSection(data) {
  // Aseguramos que la clave enviada sea siempre 'name'
  const payload = typeof data === "string" ? { name: data } : { name: data.name || data.title || data.nombre, ...data };
  
  const response = await client.post("/sections", payload);
  return response.data;
}

export async function updateSection(id, data) {
  const response = await client.put(`/sections/${id}`, data);
  return response.data;
}

export async function deleteSection(id) {
  const response = await client.delete(`/sections/${id}`);
  return response.data;
}