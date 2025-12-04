export async function parseJSONResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const contentType = response.headers.get("content-type");
  const payload =
    contentType?.includes("application/json")
      ? ((await response.json()) as { message?: string })
      : { message: response.statusText };

  throw new Error(payload?.message ?? "Request failed");
}
