import request from "./client";

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function me(token) {
  return request("/auth/me", { token });
}