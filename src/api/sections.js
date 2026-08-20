import request from "./client";
import { useAuthStore } from "../store/authStore";

function token() {
  return useAuthStore.getState().token;
}

export function getSections() {
  return request("/sections");
}

export function createSection(data) {
  return request("/sections", { method: "POST", body: data, token: token() });
}

export function updateSection(id, data) {
  return request(`/sections/${id}`, { method: "PUT", body: data, token: token() });
}

export function deleteSection(id) {
  return request(`/sections/${id}`, { method: "DELETE", token: token() });
}
