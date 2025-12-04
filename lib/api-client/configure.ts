import { OpenAPI } from "@/lib/api-client";

function resolveApiBase() {
  const defaultLocal = "http://localhost:8000";
  const tunnelBase =
    process.env.NEXT_PUBLIC_API_BASE_URL_TUNNEL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL;
  const localBase =
    process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    defaultLocal;

  if (typeof window === "undefined") {
    return localBase || defaultLocal;
  }

  const host = window.location.hostname;
  const isLocalHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local") ||
    /^[0-9.]+$/.test(host) && host.startsWith("192.");

  return isLocalHost ? localBase || defaultLocal : tunnelBase || localBase || defaultLocal;
}

export function configureApiClient(accessToken?: string) {
  OpenAPI.BASE = resolveApiBase();

  if (accessToken) {
    OpenAPI.TOKEN = accessToken;
  }
}
