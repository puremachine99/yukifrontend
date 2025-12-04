"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, LayoutGrid, Rows3, Search } from "lucide-react";

import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";

import type { AddAuctionItemsDto } from "@/lib/api-client/models/AddAuctionItemsDto";
import type { AuctionItemInputDto } from "@/lib/api-client/models/AuctionItemInputDto";

interface AvailableItemDto {
  id: number;
  name?: string;
  variety?: string;
  size?: string | number | null;
  gender?: string | null;
  media?: Array<{ url?: string | null }>;
  primaryImage?: string | null;
}

const normalizeItems = (p: unknown): AvailableItemDto[] => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (typeof p === "object") {
    const r = p as Record<string, any>;
    if (Array.isArray(r.data)) return r.data;
    if (Array.isArray(r.items)) return r.items;
  }
  return [];
};

const normalizeAuctionDetail = (p: unknown) => {
  if (!p || typeof p !== "object") return null;
  const r = p as any;
  return {
    id: r?.id ?? null,
    title: r?.title ?? "",
    status: r?.status ?? "draft",
  };
};

interface PricingState {
  selected: boolean;
  openBid: string;
  increment: string;
  buyNow: string;
}

export default function AddItemsToAuctionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, initialized } = useAuthSession();

  const auctionId = Number(params?.id);

  const [auction, setAuction] = useState<{ id: number; title?: string | null } | null>(null);
  const [items, setItems] = useState<AvailableItemDto[]>([]);
  const [pricing, setPricing] = useState<Record<number, PricingState>>({});

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [loadingAuction, setLoadingAuction] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  const [auctionError, setAuctionError] = useState<string | null>(null);
  const [itemsError, setItemsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  /** -------------------------------------------
   *  LOAD AUCTION DETAIL (DRAFT/SCHEDULED/ACTIVE)
   * ------------------------------------------*/
  useEffect(() => {
    if (!initialized) return;
    if (!auctionId) {
      setAuctionError("Auction tidak ditemukan.");
      setLoadingAuction(false);
      return;
    }
    if (!accessToken) {
      setAuctionError("Masuk untuk melanjutkan.");
      setLoadingAuction(false);
      return;
    }

    configureApiClient(accessToken);
    setLoadingAuction(true);
    setAuctionError(null);

    const request = AuctionService.auctionControllerGetAuctionDetail(auctionId);

    request
      .then((res) => {
        const normalized = normalizeAuctionDetail(res);
        if (!normalized?.id) {
          setAuctionError("Draft tidak ditemukan.");
          return;
        }
        setAuction(normalized);
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setAuctionError("Tidak dapat memuat draft.");
      })
      .finally(() => setLoadingAuction(false));

    return () => {
      if (typeof request.cancel === "function") {
        request.cancel();
      }
    };
  }, [auctionId, accessToken, initialized]);

  /** -------------------------------------------
   *  LOAD SELLER AVAILABLE ITEMS
   * ------------------------------------------*/
  useEffect(() => {
    if (!initialized || !auctionId) return;
    if (!accessToken) {
      setItems([]);
      setItemsError("Masuk untuk melihat item.");
      setLoadingItems(false);
      return;
    }

    configureApiClient(accessToken);
    setLoadingItems(true);
    setItemsError(null);

    const request = AuctionService.auctionControllerGetAvailableItems(auctionId);

    request
      .then((payload) => {
        const available = normalizeItems(payload);
        setItems(available);

        setPricing((prev) => {
          const next: Record<number, PricingState> = {};
          available.forEach((item) => {
            next[item.id] =
              prev[item.id] ??
              ({
                selected: false,
                openBid: "",
                increment: "",
                buyNow: "",
              } as PricingState);
          });
          return next;
        });

        if (!available.length) {
          setItemsError("Tidak ada item yang tersedia.");
        }
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setItemsError("Tidak dapat memuat item.");
      })
      .finally(() => setLoadingItems(false));

    return () => {
      if (typeof request.cancel === "function") {
        request.cancel();
      }
    };
  }, [auctionId, accessToken, initialized]);

  /** -------------------------------------------
   *  FILTERING
   * ------------------------------------------*/
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter((i) => `${i.name} ${i.variety}`.toLowerCase().includes(q));
  }, [items, search]);

  const selectedItems = useMemo(
    () => Object.entries(pricing).filter(([, v]) => v.selected),
    [pricing]
  );

  /** -------------------------------------------
   *  HANDLERS
   * ------------------------------------------*/
  const toggleItem = (id: number) => {
    setPricing((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? { selected: false, openBid: "", increment: "", buyNow: "" }),
        selected: !prev[id]?.selected,
      },
    }));
  };

  const changePrice = (
    id: number,
    key: keyof Omit<PricingState, "selected">,
    value: string
  ) => {
    setPricing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [key]: value },
    }));
  };

  const save = async () => {
    if (!accessToken) {
      toast.error("Login untuk melanjutkan.");
      return;
    }
    if (!selectedItems.length) {
      toast.error("Pilih minimal satu item.");
      return;
    }

    const list: AuctionItemInputDto[] = [];

    for (const [id, p] of selectedItems) {
      const openBid = Number(p.openBid);
      const inc = Number(p.increment);
      const buy = p.buyNow ? Number(p.buyNow) : undefined;

      if (!(openBid > 0 && inc > 0)) {
        toast.error("Open bid & increment wajib > 0.");
        return;
      }

      list.push({ itemId: Number(id), openBid, increment: inc, buyNow: buy });
    }

    setSubmitting(true);
    try {
      configureApiClient(accessToken);
      await AuctionService.auctionControllerAddAuctionItems(auctionId, {
        items: list,
      });
      toast.success("Item berhasil ditambahkan.");
      router.push(`/dashboard/seller/auctions/${auctionId}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Gagal menambahkan item.");
    } finally {
      setSubmitting(false);
    }
  };

  /** -------------------------------------------
   *  UI
   * ------------------------------------------*/
  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="gap-2 w-fit">
        <a href={`/dashboard/seller/auctions/${auctionId}`}>
          <ArrowLeft className="size-4" /> Kembali
        </a>
      </Button>

      <div>
        <p className="text-xs uppercase text-muted-foreground tracking-widest">
          Tambah Item
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {auction?.title ?? "Auction"}
        </h1>
      </div>

      {auctionError && (
        <div className="rounded-xl border border-destructive p-4 bg-destructive/10 text-destructive">
          {auctionError}
        </div>
      )}

      {/* FILTER */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Filter Item</CardTitle>
          <CardDescription>Cari koi untuk ditambahkan ke lelang.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {/* search */}
          <div className="space-y-2">
            <Label>Cari</Label>
            <div className="relative">
              <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau varietas"
                className="pl-9"
              />
            </div>
          </div>

          {/* view mode */}
          <div className="space-y-2">
            <Label>Mode Tampilan</Label>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="size-4" /> Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                <Rows3 className="size-4" /> List
              </Button>
            </div>
          </div>

          {/* selected count */}
          <div className="space-y-2">
            <Label>Dipilih</Label>
            <div className="border rounded-xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
              <Filter className="size-4" /> {selectedItems.length} item
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ITEM LIST */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Daftar Item</CardTitle>
          <CardDescription>Pilih dan atur harga sebelum menambahkan.</CardDescription>
        </CardHeader>

        <CardContent>
          {itemsError && !loadingItems && (
            <div className="border border-destructive p-4 rounded-xl bg-destructive/10 text-destructive">
              {itemsError}
            </div>
          )}

          {loadingItems ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner className="size-6" />
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-muted-foreground">Tidak ada item yang tersedia.</p>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((i) => (
                <div key={i.id} className="border rounded-2xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={pricing[i.id]?.selected ?? false}
                      onCheckedChange={() => toggleItem(i.id)}
                    />
                    <div>
                      <p className="font-semibold">{i.name ?? `Item #${i.id}`}</p>
                      <p className="text-xs text-muted-foreground">{i.variety}</p>
                    </div>
                  </div>

                  <img
                    src={i.media?.[0]?.url ?? i.primaryImage ?? "/placeholder.svg"}
                    className="w-full rounded-xl border object-cover"
                  />

                  <div className="grid gap-3">
                    <Input
                      type="number"
                      placeholder="Open bid"
                      value={pricing[i.id]?.openBid ?? ""}
                      onChange={(e) => changePrice(i.id, "openBid", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Increment"
                      value={pricing[i.id]?.increment ?? ""}
                      onChange={(e) => changePrice(i.id, "increment", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Buy now (opsional)"
                      value={pricing[i.id]?.buyNow ?? ""}
                      onChange={(e) => changePrice(i.id, "buyNow", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((i) => (
                <div key={i.id} className="border rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={pricing[i.id]?.selected ?? false}
                      onCheckedChange={() => toggleItem(i.id)}
                    />
                    <div>
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.variety}</p>
                    </div>
                    <Badge variant="outline">{i.size ?? "-"}</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 w-full md:w-auto">
                    <Input
                      type="number"
                      placeholder="Open bid"
                      value={pricing[i.id]?.openBid ?? ""}
                      onChange={(e) => changePrice(i.id, "openBid", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Increment"
                      value={pricing[i.id]?.increment ?? ""}
                      onChange={(e) => changePrice(i.id, "increment", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Buy now"
                      value={pricing[i.id]?.buyNow ?? ""}
                      onChange={(e) => changePrice(i.id, "buyNow", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUBMIT */}
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{selectedItems.length} item terpilih</p>
            <p className="text-xs text-muted-foreground">Pastikan harga benar.</p>
          </div>
          <Button onClick={save} disabled={submitting || !selectedItems.length}>
            {submitting ? "Menambahkan..." : "Tambahkan ke Lelang"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
