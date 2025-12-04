"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Image } from "lucide-react";

import { AuctionDetail, updateAuction } from "@/lib/api/auction";
import { useAuthSession } from "@/hooks/use-auth-session";

type UploadResponse = {
  url: string;
};

interface EditAuctionModalProps {
  auction: AuctionDetail;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditAuctionModal({ auction, onClose, onSaved }: EditAuctionModalProps) {
  const { accessToken } = useAuthSession();
  const [title, setTitle] = useState(auction.title);
  const [description, setDescription] = useState(auction.description ?? "");
  const [bannerUrl, setBannerUrl] = useState(auction.bannerUrl ?? "");
  const [bannerPreview, setBannerPreview] = useState<string | null>(auction.bannerUrl ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    setTitle(auction.title);
    setDescription(auction.description ?? "");
    setBannerUrl(auction.bannerUrl ?? "");
    setBannerPreview(auction.bannerUrl ?? null);
  }, [auction]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const uploadBannerFile = async (file: File) => {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await fetch("/api/upload/banner", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(payload || "Gagal mengunggah banner.");
    }

    const payload = (await response.json()) as UploadResponse;
    if (!payload.url) {
      throw new Error("Tidak ada URL banner yang diterima.");
    }

    return payload.url;
  };

  const handleBannerSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setBannerPreview(objectUrl);
    setBannerUrl("");
    setIsUploading(true);

    try {
      const url = await uploadBannerFile(file);
      setBannerUrl(url);
      toast.success("Banner berhasil diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah banner.");
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit = Boolean(title.trim()) && Boolean(bannerUrl) && !isUploading;

  const handleSave = async () => {
    if (!canSubmit) {
      toast.error("Lengkapi judul dan banner sebelum menyimpan.");
      return;
    }

    if (!accessToken) {
      toast.error("Tidak dapat menyimpan tanpa sesi masuk.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAuction(
        auction.id,
        {
          title: title.trim(),
          description: description.trim(),
          bannerUrl,
        },
        accessToken
      );
      toast.success("Perubahan disimpan.");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Edit Auction Info</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ubah judul, deskripsi, atau banner. Draft akan selalu siap untuk di-update.
          </p>
        </DialogHeader>

        <div className="space-y-4 pb-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Banner</Label>
            <div className="rounded-2xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
              {bannerPreview ? (
                <div className="overflow-hidden rounded-2xl border">
                  <img
                    src={bannerPreview}
                    alt="Current banner"
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex min-h-[160px] flex-col items-center justify-center gap-2">
                  <Image className="size-10 text-muted-foreground" />
                  <p>Banner belum tersedia</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="outline" className="gap-2" asChild disabled={isUploading}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Upload className="size-4" />
                    {isUploading ? "Mengunggah..." : "Ganti banner"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleBannerSelected}
                      disabled={isUploading}
                    />
                  </label>
                </Button>
                {bannerUrl && !isUploading && (
                  <Badge variant="outline" className="text-xs">
                    Tersimpan
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
