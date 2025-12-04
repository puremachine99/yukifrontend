"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";
import type { itemsEntity } from "@/lib/api-client/models/itemsEntity";
import { MediaInput } from "@/lib/api-client/models/MediaInput";
import { CreateMediaDto } from "@/lib/api-client/models/CreateMediaDto";
import type { UpdateItemDto } from "@/lib/api-client/models/UpdateItemDto";
import { ItemsService } from "@/lib/api-client/services/ItemsService";
import { uploadMediaAsset } from "@/lib/api/upload";

const varietyOptions = ["Kohaku", "Showa", "Sanke", "Tancho", "Other"];
const ageOptions = [
  "Tosai (1 year)",
  "Nisai (2 years)",
  "Sansai (3 years)",
  "Yonsai (4 years)",
  "Older",
];
const genderOptions = ["Female", "Male", "Unknown"];

const initialForm = {
  name: "",
  variety: "",
  age: "",
  gender: "",
  size: "",
  description: "",
};

type MediaSource = {
  url?: string | null;
  type?: string | null;
};

const normalizeMediaResponse = (payload: unknown): MediaSource[] => {
  if (Array.isArray(payload)) {
    return payload as MediaSource[];
  }

  if (payload && typeof payload === "object") {
    const response = payload as Record<string, unknown>;
    if (Array.isArray(response.media)) {
      return response.media as MediaSource[];
    }
    if (Array.isArray(response.data)) {
      return response.data as MediaSource[];
    }
    if (Array.isArray(response.items)) {
      return response.items as MediaSource[];
    }
  }

  return [];
};

const mergeMediaSources = (
  entity: itemsEntity | null,
  extra: unknown
): MediaInput[] => {
  const rawSources: MediaSource[] = [
    ...(entity?.media ?? []),
    ...(entity?.images ?? []),
    ...normalizeMediaResponse(extra),
  ];

  const unique = new Set<string>();

  const list = rawSources
    .map((media) => {
      const url =
        typeof media?.url === "string" && media.url.length > 0
          ? media.url
          : null;
      if (!url) return null;
      const inferredType =
        (media?.type as MediaInput["type"]) ?? MediaInput.type.IMAGE;
      return { url, type: inferredType };
    })
    .filter((media): media is MediaInput => {
      if (!media) return false;
      if (unique.has(media.url)) return false;
      unique.add(media.url);
      return true;
    });

  if (!list.length && entity?.primaryImage) {
    list.push({
      url: entity.primaryImage,
      type: MediaInput.type.IMAGE,
    });
  }

  return list;
};

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken } = useAuthSession();

  const [item, setItem] = useState<itemsEntity | null>(null);
  const [form, setForm] = useState(initialForm);
  const [mediaInputs, setMediaInputs] = useState<MediaInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.id) {
      setLoading(false);
      toast.error("Item tidak ditemukan.");
      return;
    }

    configureApiClient(accessToken ?? undefined);
    setLoading(true);

    const detailRequest = ItemsService.itemsControllerFindOne(
      String(params.id)
    );
    const mediaRequest = ItemsService.itemsControllerGetMedia(
      String(params.id)
    );

    Promise.all([detailRequest, mediaRequest])
      .then(([data, mediaResponse]) => {
        const detail = data as itemsEntity;
        setItem(detail);
        setForm({
          name: detail.name ?? "",
          variety: detail.variety ?? "",
          age: detail.age ?? "",
          gender: detail.gender ?? "",
          size: detail.size ? String(detail.size) : "",
          description: detail.description ?? "",
        });
        setMediaInputs(mergeMediaSources(detail, mediaResponse));
      })
      .catch((fetchError) => {
        if (fetchError instanceof CancelError) return;
        toast.error(
          fetchError instanceof Error
            ? fetchError.message
            : "Tidak dapat memuat data item"
        );
      })
      .finally(() => setLoading(false));

    return () => {
      if (typeof detailRequest.cancel === "function") {
        detailRequest.cancel();
      }
      if (typeof mediaRequest.cancel === "function") {
        mediaRequest.cancel();
      }
    };
  }, [accessToken, params?.id]);

  const canSubmit =
    Boolean(form.name.trim()) &&
    Boolean(form.variety) &&
    Boolean(form.age) &&
    Boolean(form.gender) &&
    Number(form.size) > 0 &&
    mediaInputs.length > 0;

  const handleChange =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!accessToken) {
      toast.error("Harap masuk untuk mengunggah foto.");
      return;
    }

    if (!item?.id) {
      toast.error("Item belum siap untuk diunggah fotonya.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadMediaAsset(file);

      configureApiClient(accessToken);
      await ItemsService.itemsControllerUploadMedia(String(item.id), {
        url: uploadedUrl,
        type: CreateMediaDto.type.IMAGE,
      });

      setMediaInputs((prev) => [
        ...prev.filter((media) => media.url !== uploadedUrl),
        { url: uploadedUrl, type: MediaInput.type.IMAGE },
      ]);
      toast.success("Foto item berhasil diunggah");
    } catch (uploadErr) {
      setUploadError(
        uploadErr instanceof Error
          ? uploadErr.message
          : "Gagal mengunggah foto item"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setMediaInputs((prev) => prev.filter((image) => image.url !== url));
  };

  const handleSubmit = async () => {
    if (!item) {
      toast.error("Item tidak ditemukan.");
      return;
    }

    if (!canSubmit) {
      toast.error("Lengkapi semua data, termasuk foto.");
      return;
    }

    if (!accessToken) {
      toast.error("Harap masuk kembali untuk menyimpan perubahan.");
      return;
    }

    const sizeValue = Number(form.size);
    if (Number.isNaN(sizeValue) || sizeValue <= 0) {
      toast.error("Ukuran harus berupa angka lebih besar dari 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      configureApiClient(accessToken);
      const payload: UpdateItemDto = {
        name: form.name.trim(),
        variety: form.variety,
        age: form.age,
        gender: form.gender,
        size: sizeValue,
        description: form.description.trim() || undefined,
        media: mediaInputs,
      };

      await ItemsService.itemsControllerUpdate(String(item.id), payload);
      toast.success("Perubahan item disimpan");
      router.push(`/dashboard/seller/items/${item.id}`);
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Gagal menyimpan perubahan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-10 text-center text-sm text-destructive">
        Item tidak ditemukan atau sudah dihapus.
      </div>
    );
  }

  const previewImages = mediaInputs
    .map((media) => media.url)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Item</h1>
          <p className="text-sm text-muted-foreground">
            Perbarui informasi koi dan jagalah galeri tetap terbaru.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle>Informasi Item</CardTitle>
          <CardDescription>Pastikan foto dan deskripsi selalu akurat.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nama
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Varietas</label>
              <Select
                value={form.variety}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, variety: value }))
                }
              >
                <SelectTrigger>
                <SelectValue placeholder="Pilih varietas" />
                </SelectTrigger>
                <SelectContent>
                  {varietyOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usia</label>
              <Select
                value={form.age}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, age: value }))
                }
              >
                <SelectTrigger>
                <SelectValue placeholder="Pilih usia" />
                </SelectTrigger>
                <SelectContent>
                  {ageOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis kelamin</label>
              <Select
                value={form.gender}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ukuran (cm)</label>
              <Input
                type="number"
                min={1}
                value={form.size}
                onChange={handleChange("size")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={handleChange("description")}
            />
          </div>

      <div className="space-y-3">
            <p className="text-sm font-medium">Foto</p>
        <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-3">
            {previewImages.length ? (
              previewImages.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt="Item preview"
                    className="h-24 w-32 rounded-xl border object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-destructive border"
                    onClick={() => handleRemoveImage(url)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground">
                Belum ada foto yang ditautkan.
              </div>
            )}
          </div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="outline" className="gap-2" asChild disabled={isUploading}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Upload className="size-4" />
                    {isUploading ? "Mengunggah..." : "Tambah foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleUpload}
                      disabled={isUploading}
                    />
                  </label>
                </Button>
                <span className="text-xs text-muted-foreground">
                  {mediaInputs.length} foto tertaut
                </span>
              </div>
              {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end">
        <Button
          className="gap-2"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting || isUploading}
        >
          <Save className="size-4" />
          {isSubmitting ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
