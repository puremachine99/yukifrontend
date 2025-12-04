"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Upload, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import type { CreateItemDto } from "@/lib/api-client/models/CreateItemDto";
import { MediaInput } from "@/lib/api-client/models/MediaInput";
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

export default function CreateItemPage() {
  const router = useRouter();
  const { accessToken } = useAuthSession();

  const [form, setForm] = useState(initialForm);
  const [mediaInputs, setMediaInputs] = useState<MediaInput[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    form.name.trim() &&
    form.variety &&
    form.age &&
    form.gender &&
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

    setUploadError(null);
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadMediaAsset(file);
      setMediaInputs((prev) => [
        ...prev,
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
    if (!canSubmit) {
      toast.error("Isikan semua data & unggah minimal satu foto.");
      return;
    }

    if (!accessToken) {
      toast.error("Harap masuk kembali untuk menyimpan item.");
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
      const payload: CreateItemDto = {
        name: form.name.trim(),
        variety: form.variety,
        gender: form.gender,
        age: form.age,
        size: sizeValue,
        description: form.description.trim() || undefined,
        category: "koi",
        attributes: {},
        media: mediaInputs,
      };

      const created = await ItemsService.itemsControllerCreate(payload);
      toast.success("Item berhasil ditambahkan ke inventory");
      const createdId =
        (created as { id?: string | number })?.id ?? undefined;
      router.push(
        createdId
          ? `/dashboard/seller/items/${createdId}`
          : "/dashboard/seller/items"
      );
    } catch (createError) {
      toast.error(
        createError instanceof Error
          ? createError.message
          : "Gagal menyimpan item. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImages = mediaInputs
    .map((media) => media.url)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Penjual • Inventaris
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Item Baru</h1>
          <p className="text-sm text-muted-foreground">
            Daftarkan koi kamu ke marketplace dan jaga katalog tetap menarik.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <a href="/dashboard/seller/items">
            <ArrowLeft className="size-4" />
            Kembali ke daftar
          </a>
        </Button>
      </div>

      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle>Informasi Item</CardTitle>
          <CardDescription>
            Required fields are marked with an asterisk. Kamu dapat menambahkan
            foto dan catatan tambahan nanti.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Nama*</Label>
              <Input
                id="item-name"
                placeholder="Contoh: Kohaku Jumbo"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-variety">Varietas*</Label>
              <Select
                id="item-variety"
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
              <Label htmlFor="item-age">Usia*</Label>
              <Select
                id="item-age"
                value={form.age}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, age: value }))
                }
              >
                <SelectTrigger>
                <SelectValue placeholder="Pilih kelas usia" />
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
              <Label htmlFor="item-gender">Jenis kelamin*</Label>
              <Select
                id="item-gender"
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
              <Label htmlFor="item-size">Ukuran (cm)*</Label>
              <Input
                id="item-size"
                type="number"
                placeholder="Contoh: 60"
                value={form.size}
                onChange={handleChange("size")}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">Deskripsi</Label>
            <Textarea
              id="item-description"
              className="h-24"
              placeholder="Catatan tambahan tentang koi..."
              value={form.description}
              onChange={handleChange("description")}
            />
          </div>

          <div className="space-y-3">
            <Label>Foto*</Label>
            <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-3">
                {previewImages.length ? (
                  previewImages.map((url) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        className="h-24 w-32 rounded-xl border object-cover"
                        alt="Uploaded item"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 rounded-full bg-white/80 p-1 text-xs text-destructive border"
                        onClick={() => handleRemoveImage(url)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Belum ada foto yang diunggah.
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isUploading}
                  asChild
                >
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
                {mediaInputs.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {mediaInputs.length} foto siap
                  </span>
                )}
              </div>
              {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isUploading}
          >
            {isSubmitting ? "Menyimpan…" : "Simpan Draft"}
          </Button>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        {/* Seluruh foto tersimpan aman di instance Minio lokal kamu. */}
      </div>
    </div>
  );
}
