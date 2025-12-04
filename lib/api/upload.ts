export interface UploadResponse {
  url: string;
}

export async function uploadMediaAsset(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("banner", file);

  const response = await fetch("/api/upload/banner", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to upload media asset.");
  }

  const payload = (await response.json()) as UploadResponse;
  if (!payload.url) {
    throw new Error("The upload endpoint did not return a URL.");
  }

  return payload.url;
}
