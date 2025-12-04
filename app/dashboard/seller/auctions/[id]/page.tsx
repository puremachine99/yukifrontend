"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Pencil, PlusCircle, Save, Trash2 } from "lucide-react";

import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import type { UpdateAuctionDto } from "@/lib/api-client/models/UpdateAuctionDto";
import type { UpdateAuctionItemDto } from "@/lib/api-client/models/UpdateAuctionItemDto";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";

interface AuctionDetailDto {
  id: number;
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  status?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt?: string | null;
  itemCount?: number | null;
}

interface AuctionItemDto {
  id: number;
  itemId: number;
  openBid?: number | string | null;
  increment?: number | string | null;
  buyNow?: number | string | null;
  status?: string | null;
  item?: {
    id?: number;
    name?: string;
    variety?: string;
    size?: string | number | null;
    media?: Array<{ url?: string | null }>;
    primaryImage?: string | null;
  };
}

const normalizeAuctionDetail = (payload: unknown): AuctionDetailDto | null => {
  if (!payload || typeof payload !== "object") return null;
  return payload as AuctionDetailDto;
};

const normalizeAuctionItems = (payload: unknown): AuctionItemDto[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as AuctionItemDto[];
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as AuctionItemDto[];
    if (Array.isArray(record.items)) return record.items as AuctionItemDto[];
  }
  return [];
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Belum dijadwalkan";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type PricingState = Record<number, { openBid: string; increment: string; buyNow: string }>;

export default function AuctionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken } = useAuthSession();
  const auctionId = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);

  const [auction, setAuction] = useState<AuctionDetailDto | null>(null);
  const [items, setItems] = useState<AuctionItemDto[]>([]);
  const [pricing, setPricing] = useState<PricingState>({});
  const [form, setForm] = useState({ title: "", description: "", bannerUrl: "" });
  const [schedule, setSchedule] = useState({ start: "", end: "" });

  const [isLoadingAuction, setIsLoadingAuction] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingItem, setIsUpdatingItem] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const loadAuction = useCallback(() => {
    if (!auctionId || !accessToken) {
      setError("Draft tidak ditemukan.");
      setIsLoadingAuction(false);
      return;
    }

    configureApiClient(accessToken);
    setIsLoadingAuction(true);
    setError(null);

    const request = AuctionService.auctionControllerGetAuctionDetail(auctionId);
    request
      .then((response) => {
        const detail = normalizeAuctionDetail(response);
        setAuction(detail);
        setForm({
          title: detail?.title ?? "",
          description: detail?.description ?? "",
          bannerUrl: detail?.bannerUrl ?? "",
        });
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(err instanceof Error ? err.message : "Tidak dapat memuat detail.");
      })
      .finally(() => setIsLoadingAuction(false));

    return () => {
      if (typeof request.cancel === "function") request.cancel();
    };
  }, [auctionId, accessToken]);

  const loadItems = useCallback(() => {
    if (!auctionId || !accessToken) {
      setItems([]);
      setItemsError(accessToken ? null : "Masuk untuk melihat item.");
      setIsLoadingItems(false);
      return;
    }

    configureApiClient(accessToken);
    setIsLoadingItems(true);
    setItemsError(null);

    const request = AuctionService.auctionControllerGetAuctionItems(auctionId);
    request
      .then((payload) => {
        const normalized = normalizeAuctionItems(payload);
        setItems(normalized);
        setPricing((prev) => {
          const next: PricingState = {};
          normalized.forEach((item) => {
            const key = item.itemId;
            const existing = prev[key];
            next[key] =
              existing ?? {
                openBid: item.openBid ? String(item.openBid) : "",
                increment: item.increment ? String(item.increment) : "",
                buyNow: item.buyNow ? String(item.buyNow) : "",
              };
          });
          return next;
        });
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setItemsError(err instanceof Error ? err.message : "Tidak dapat memuat item.");
      })
      .finally(() => setIsLoadingItems(false));

    return () => {
      if (typeof request.cancel === "function") request.cancel();
    };
  }, [auctionId, accessToken]);

  useEffect(() => {
    const cleanup = loadAuction();
    return () => cleanup?.();
  }, [loadAuction]);

  useEffect(() => {
    const cleanup = loadItems();
    return () => cleanup?.();
  }, [loadItems]);

  const normalizedStatus = useMemo(() => (auction?.status ?? "").toLowerCase(), [auction?.status]);
  const isDraft = normalizedStatus === "draft";
  const isScheduled = normalizedStatus === "scheduled";
  const canEdit = isDraft || isScheduled;
  const canLaunch = isDraft && items.length > 0;

  const handleFormChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!auction || !accessToken) {
      toast.error("Tidak ada draft untuk disimpan.");
      return;
    }

    setIsSaving(true);
    try {
      configureApiClient(accessToken);
      const payload: UpdateAuctionDto = {
        title: form.title.trim() || undefined,
        description: form.description.trim() || undefined,
        bannerUrl: isDraft ? form.bannerUrl || undefined : undefined,
      };
      await AuctionService.auctionControllerUpdate(String(auction.id), payload);
      toast.success("Perubahan disimpan.");
      loadAuction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePricingChange = (itemId: number, key: keyof UpdateAuctionItemDto, value: string) => {
    setPricing((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [key]: value,
      },
    }));
  };

  const handleUpdateItem = async (itemId: number) => {
    if (!accessToken) {
      toast.error("Butuh sesi masuk.");
      return;
    }
    const state = pricing[itemId];
    if (!state) return;

    const openBid = Number(state.openBid);
    const increment = Number(state.increment);
    const buyNow = state.buyNow ? Number(state.buyNow) : undefined;

    if (!Number.isFinite(openBid) || openBid <= 0 || !Number.isFinite(increment) || increment <= 0) {
      toast.error("Open bid & increment harus angka valid.");
      return;
    }

    setIsUpdatingItem(itemId);
    try {
      configureApiClient(accessToken);
      const payload: UpdateAuctionItemDto = { openBid, increment, buyNow };
      await AuctionService.auctionControllerUpdateAuctionItemPrice(auctionId, itemId, payload);
      toast.success("Harga item diperbarui.");
      loadItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui harga.");
    } finally {
      setIsUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!accessToken) {
      toast.error("Butuh sesi masuk.");
      return;
    }
    const confirmed = window.confirm("Hapus item dari lelang?");
    if (!confirmed) return;
    try {
      configureApiClient(accessToken);
      await AuctionService.auctionControllerRemoveAuctionItem(auctionId, itemId);
      toast.success("Item dihapus.");
      loadItems();
      loadAuction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus item.");
    }
  };

  const handleLaunch = async () => {
    if (!auction) {
      toast.error("Draft tidak ditemukan.");
      return;
    }
    if (!schedule.start || !schedule.end) {
      toast.error("Isi jadwal mulai dan selesai.");
      return;
    }
    if (!accessToken) {
      toast.error("Butuh sesi masuk.");
      return;
    }

    const startTime = new Date(schedule.start);
    const endTime = new Date(schedule.end);
    if (!(startTime instanceof Date) || !(endTime instanceof Date) || startTime >= endTime) {
      toast.error("Periksa kembali jadwal.");
      return;
    }

    setIsLaunching(true);
    try {
      configureApiClient(accessToken);
      await AuctionService.auctionControllerLaunch(String(auction.id), {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      toast.success("Lelang dijadwalkan.");
      loadAuction();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal launch.");
    } finally {
      setIsLaunching(false);
    }
  };

  if (isLoadingAuction && !auction) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
        {error ?? "Lelang tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Auction #{auction.id}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{auction.title}</h1>
          <p className="text-sm text-muted-foreground">{auction.description || "Belum ada deskripsi."}</p>
        </div>
        <Badge variant={isDraft ? "outline" : isScheduled ? "secondary" : "default"} className="px-4 py-1 text-sm w-fit">
          {auction.status ?? "Unknown"}
        </Badge>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={form.title} onChange={handleFormChange("title")} disabled={!canEdit} />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea rows={5} value={form.description} onChange={handleFormChange("description")} disabled={!canEdit} />
            </div>
            {isDraft && (
              <div className="space-y-2">
                <Label>Banner URL</Label>
                <Input value={form.bannerUrl} onChange={handleFormChange("bannerUrl")} placeholder="https://..." />
              </div>
            )}
            {canEdit && (
              <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                <Save className="size-4" />
                {isSaving ? "Menyimpan..." : "Simpan"}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <img src={auction.bannerUrl ?? "/placeholder.svg"} alt="Banner" className="w-full rounded-2xl border object-cover" />
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <p className="text-xs uppercase">Mulai</p>
                <p className="font-semibold">{formatDateTime(auction.startTime ?? auction.startsAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase">Selesai</p>
                <p className="font-semibold">{formatDateTime(auction.endTime ?? auction.endsAt)}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <a href={`/dashboard/seller/auctions/${auction.id}/add-items`}>
                <PlusCircle className="size-4" />
                Kelola Item
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {canLaunch && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Launch Auction</CardTitle>
            <CardDescription>Jadwalkan waktu mulai & selesai sebelum lelang dibuka.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="datetime-local" value={schedule.start} onChange={(e) => setSchedule((prev) => ({ ...prev, start: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="datetime-local" value={schedule.end} onChange={(e) => setSchedule((prev) => ({ ...prev, end: e.target.value }))} />
              </div>
            </div>
            <Button onClick={handleLaunch} disabled={isLaunching}>
              {isLaunching ? "Menjadwalkan..." : "Launch"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Items Dalam Lelang</CardTitle>
          <CardDescription>Atur open bid, increment, dan buy now sesuai kebutuhan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {itemsError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {itemsError}
            </div>
          )}
          {isLoadingItems ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner className="size-6" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada item di lelang ini.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const base = item.item;
                const mediaUrl = base?.media?.find((m) => m?.url)?.url ?? base?.primaryImage ?? "/placeholder.svg";
                const canEditItem = isDraft;
                const pricingState = pricing[item.itemId] ?? { openBid: "", increment: "", buyNow: "" };
                return (
                  <div key={item.itemId} className="rounded-2xl border p-4 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <img src={mediaUrl ?? "/placeholder.svg"} alt={base?.name ?? "Item"} className="h-20 w-28 rounded-xl object-cover border" />
                        <div>
                          <p className="font-semibold">{base?.name ?? `Item #${item.itemId}`}</p>
                          <p className="text-xs text-muted-foreground">{base?.variety ?? "Varietas tidak tersedia"}</p>
                        </div>
                      </div>
                      {canEditItem && (
                        <Button
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleRemoveItem(item.itemId)}
                        >
                          <Trash2 className="size-4 mr-1" /> Hapus
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Open Bid</Label>
                        <Input
                          type="number"
                          value={pricingState.openBid}
                          onChange={(e) => handlePricingChange(item.itemId, "openBid", e.target.value)}
                          disabled={!canEditItem}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Increment</Label>
                        <Input
                          type="number"
                          value={pricingState.increment}
                          onChange={(e) => handlePricingChange(item.itemId, "increment", e.target.value)}
                          disabled={!canEditItem}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Buy Now (opsional)</Label>
                        <Input
                          type="number"
                          value={pricingState.buyNow}
                          onChange={(e) => handlePricingChange(item.itemId, "buyNow", e.target.value)}
                          disabled={!canEditItem}
                        />
                      </div>
                    </div>

                    {canEditItem && (
                      <Button
                        className="gap-2"
                        onClick={() => handleUpdateItem(item.itemId)}
                        disabled={isUpdatingItem === item.itemId}
                      >
                        <Pencil className="size-4" />
                        {isUpdatingItem === item.itemId ? "Menyimpan..." : "Simpan Harga"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">Jumlah item: {items.length}</div>
        <Button variant="outline" asChild>
          <a href="/dashboard/seller/auctions">Kembali ke daftar</a>
        </Button>
      </div>
    </div>
  );
}
