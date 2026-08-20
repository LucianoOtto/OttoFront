import request from "./client";
import { useAuthStore } from "../store/authStore";

function token() {
  return useAuthStore.getState().token;
}

export function getCategories() {
  return request("/categories");
}

export function createCategory(data) {
  return request("/categories", { method: "POST", body: data, token: token() });
}

export function updateCategory(id, data) {
  return request(`/categories/${id}`, { method: "PUT", body: data, token: token() });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: "DELETE", token: token() });
}