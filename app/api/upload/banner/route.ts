"use server";

import { NextResponse } from "next/server";
import { createHash, createHmac, randomUUID } from "crypto";

const endpoint = process.env.MINIO_ENDPOINT ?? "http://localhost:9000";
const bucketName = process.env.MINIO_BUCKET ?? "yukiauction-banners";
const accessKey = process.env.MINIO_ACCESS_KEY ?? "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY ?? "minioadmin";
const region = process.env.MINIO_REGION ?? "us-east-1";

const minioUrl = new URL(endpoint);
const host = minioUrl.host;
const protocol = minioUrl.protocol.replace(":", "");
const publicUrl =
  process.env.MINIO_PUBLIC_URL ?? `${minioUrl.protocol}//${minioUrl.host}`;

class MinioError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "MinioError";
  }
}

function hashValue(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function getSigningKey(dateStamp: string) {
  const kDate = createHmac("sha256", `AWS4${secretKey}`)
    .update(dateStamp)
    .digest();
  const kRegion = createHmac("sha256", kDate).update(region).digest();
  const kService = createHmac("sha256", kRegion).update("s3").digest();
  const kSigning = createHmac("sha256", kService).update("aws4_request").digest();
  return kSigning;
}

async function minioRequest(
  method: string,
  objectPath: string,
  body?: Buffer,
  extraHeaders: Record<string, string> = {}
) {
  const now = new Date();
  const amzDate = now
    .toISOString()
    .replace(/[:-]/g, "")
    .replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);
  const payload = body ?? Buffer.alloc(0);
  const payloadHash = hashValue(payload);

  const canonicalUri = encodeURI(objectPath);
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashValue(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(dateStamp);
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers: Record<string, string> = {
    host,
    Authorization: authorization,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders,
  };

  const url = `${protocol}://${host}${objectPath}`;
  const response = await fetch(url, {
    method,
    headers,
    body: payload.length > 0 ? payload : undefined,
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new MinioError(
      response.status,
      `MinIO request failed (${response.status}): ${bodyText}`
    );
  }

  return response;
}

let bucketPromise: Promise<void> | null = null;

async function ensureBucketExists() {
  if (bucketPromise) return bucketPromise;

  bucketPromise = (async () => {
    try {
      await minioRequest("PUT", `/${bucketName}`, undefined, {
        "Content-Length": "0",
      });
    } catch (error) {
      if (error instanceof MinioError && error.status === 409) {
        return;
      }
      throw error;
    }
  })();

  return bucketPromise;
}

function sanitizeFileName(name: string) {
  const sanitized = name.replace(/[^a-zA-Z0-9-_/.]/g, "-");
  return sanitized.slice(0, 64);
}

function handleMinioError(error: unknown, fallbackMessage: string) {
  const detail =
    error instanceof MinioError
      ? error.message
      : error instanceof Error
      ? error.message
      : "unknown error";

  return NextResponse.json(
    {
      message: `${fallbackMessage} (${detail})`,
    },
    { status: 502 }
  );
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("banner");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Banner file is required" },
      { status: 400 }
    );
  }

  try {
    await ensureBucketExists();
  } catch (error) {
    return handleMinioError(error, "Tidak dapat membuat bucket Minio");
  }

  const objectName = `banners/${Date.now()}-${randomUUID()}-${sanitizeFileName(
    file.name
  )}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  try {
    await minioRequest("PUT", `/${bucketName}/${objectName}`, buffer, {
      "Content-Type": contentType,
    });
  } catch (error) {
    return handleMinioError(error, "Tidak dapat mengunggah banner ke Minio");
  }

  const publicBannerUrl = `${publicUrl}/${bucketName}/${objectName}`;

  return NextResponse.json({ url: publicBannerUrl });
}
