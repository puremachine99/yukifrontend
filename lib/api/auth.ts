import { parseJSONResponse } from "@/lib/api/fetcher";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export interface AuthUser {
  id?: number;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

export interface RawLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const defaultHeaders = {
  "Content-Type": "application/json",
};

function ensureTokenField(value?: string, fallback?: string): string | null {
  return value ?? fallback ?? null;
}

function normalizeLoginResponse(payload: RawLoginResponse): LoginResponse {
  const accessToken = ensureTokenField(payload.accessToken, payload.access_token);
  if (!accessToken) {
    throw new Error("Login response did not include an access token.");
  }

  return {
    accessToken,
    refreshToken: ensureTokenField(payload.refreshToken, payload.refresh_token) ?? "",
    user: payload.user,
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(credentials),
  });

  const rawResponse = await parseJSONResponse<RawLoginResponse>(response);
  return normalizeLoginResponse(rawResponse);
}

export async function signup(payload: SignupPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  const rawResponse = await parseJSONResponse<RawLoginResponse>(response);
  return normalizeLoginResponse(rawResponse);
}

export const AUTH_STORAGE_KEYS = {
  accessToken: "yukiauction.accessToken",
  refreshToken: "yukiauction.refreshToken",
  user: "yukiauction.user",
};

export function persistAuthSession(payload: LoginResponse) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, payload.accessToken);

  if (payload.refreshToken) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, payload.refreshToken);
  }

  if (payload.user) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(payload.user));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  const previousValues = Object.values(AUTH_STORAGE_KEYS).reduce<
    Record<string, string | null>
  >((acc, key) => {
    acc[key] = window.localStorage.getItem(key);
    window.localStorage.removeItem(key);
    return acc;
  }, {});

  Object.entries(previousValues).forEach(([key, value]) => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        oldValue: value,
        newValue: null,
        storageArea: window.localStorage,
        url: window.location.href,
      })
    );
  });
}
