"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

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
import { ArrowLeft, CalendarRange, Sparkles, Upload } from "lucide-react";

import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import type { CreateAuctionDto } from "@/lib/api-client/models/CreateAuctionDto";

const initialForm: CreateAuctionDto = {
  title: "",
  description: "",
  bannerUrl: "",
};

type UploadResponse = {
  url: string;
};

export default function CreateAuctionPage() {
  const router = useRouter();
  const { accessToken } = useAuthSession();

  const [form, setForm] = useState(initialForm);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const canSubmit = Boolean(form.title.trim() && form.description?.trim() && form.bannerUrl && !isUploading);

  const handleChange =
    (key: keyof CreateAuctionDto) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const uploadBannerFile = async (file: File) => {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await fetch("/api/upload/banner", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Gagal mengunggah banner.");
    }

    const payload = (await response.json()) as UploadResponse;
    if (!payload.url) {
      throw new Error("Endpoint upload tidak mengembalikan URL.");
    }
    return payload.url;
  };

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setForm((prev) => ({ ...prev, bannerUrl: objectUrl }));
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadBannerFile(file);
      setForm((prev) => ({ ...prev, bannerUrl: uploaded }));
      toast.success("Banner berhasil diunggah.");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah banner.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Lengkapi semua kolom terlebih dahulu.");
      return;
    }

    if (!accessToken) {
      toast.error("Butuh sesi masuk untuk membuat lelang.");
      return;
    }

    setIsSubmitting(true);
    try {
      configureApiClient(accessToken);
      const payload: CreateAuctionDto = {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        bannerUrl: form.bannerUrl,
      };

      const created = await AuctionService.auctionControllerCreate(payload);
      const createdId = (created as { id?: number | string })?.id;
      toast.success("Lelang berhasil dibuat.");
      router.push(`/dashboard/seller/auctions/${createdId ?? ""}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat lelang.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seller • Auction Draft</p>
          <h1 className="text-2xl font-semibold tracking-tight">Buat Lelang</h1>
          <p className="text-sm text-muted-foreground">Masukkan informasi dasar. Jadwal ditentukan saat launch.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/dashboard/seller/auctions">
              <ArrowLeft className="size-4" />
              Kembali
            </a>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/items">
              <Sparkles className="size-4" />
              Pilih Item
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Lelang</CardTitle>
            <CardDescription>Judul dan deskripsi akan terlihat oleh bidder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input placeholder="Premium Night Auction" value={form.title} onChange={handleChange("title")} />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                rows={5}
                placeholder="Ceritakan highlight koi dan jadwal...
"
                value={form.description}
                onChange={handleChange("description")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Banner</CardTitle>
            <CardDescription>Gambar ini tampil di halaman landing lelang.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
              <CalendarRange className="size-4 mb-2" />Gunakan rasio 16:9 agar pas di semua perangkat.
            </div>
            {form.bannerUrl ? (
              <img src={form.bannerUrl} alt="Preview" className="w-full rounded-xl border object-cover" />
            ) : (
              <div className="aspect-video w-full rounded-xl border border-dashed bg-muted/20" />
            )}
            <div className="space-y-2">
              <Label htmlFor="auction-banner">Upload Banner</Label>
              <Button variant="outline" className="gap-2" disabled={isUploading} asChild>
                <label className="flex cursor-pointer items-center gap-2">
                  <Upload className="size-4" />
                  {isUploading ? "Mengunggah..." : "Pilih berkas"}
                  <input
                    id="auction-banner"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleBannerUpload}
                    disabled={isUploading}
                  />
                </label>
              </Button>
              {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Siap lanjut?</p>
            <p className="text-xs text-muted-foreground">Kamu bisa menambahkan item setelah draft dibuat.</p>
          </div>
          <Button className="gap-2" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Draft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
