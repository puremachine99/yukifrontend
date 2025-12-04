"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import { ItemCard } from "@/components/item/item-card";
import { ItemRow } from "@/components/item/item-row";

import {
  Plus,
  Gauge,
  Scale,
  Layers,
  LayoutGrid,
  Rows3,
  Sparkles,
} from "lucide-react";

import { CancelError } from "@/lib/api-client/core/CancelablePromise";
import { ItemsService } from "@/lib/api-client/services/ItemsService";
import { configureApiClient } from "@/lib/api-client/configure";

import { useAuthSession } from "@/hooks/use-auth-session";

const VIEW_STATES: Array<"grid" | "list"> = ["grid", "list"];

const normalizeItemsResponse = (payload: unknown): itemsEntity[] => {
  if (Array.isArray(payload)) {
    return payload as itemsEntity[];
  }

  if (payload && typeof payload === "object") {
    const response = payload as Record<string, unknown>;
    if (Array.isArray(response.items)) {
      return response.items as itemsEntity[];
    }
    if (Array.isArray(response.data)) {
      return response.data as itemsEntity[];
    }
    if (Array.isArray(response.results)) {
      return response.results as itemsEntity[];
    }
  }

  return [];
};

export default function SellerItemsPage() {
  const router = useRouter();
  const { accessToken } = useAuthSession();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [variety, setVariety] = useState("all");
  const [sort, setSort] = useState("az");
  const [items, setItems] = useState<itemsEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------------------------
   * FETCH DATA ITEMS
   * --------------------------------------------------------- */
  useEffect(() => {
    if (!accessToken) {
      setItems([]);
      return;
    }

    configureApiClient(accessToken);
    setIsLoading(true);
    setError(null);

    const request = ItemsService.itemsControllerGetMyItems();

    request
      .then((data) => setItems(normalizeItemsResponse(data)))
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(
          err instanceof Error
            ? err.message
            : "Tidak dapat memuat data item"
        );
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (typeof request.cancel === "function") {
        request.cancel();
      }
    };
  }, [accessToken]);

  /* -----------------------------------------------------------
   * COMPUTED VALUES
   * --------------------------------------------------------- */
  const totalItems = items.length;

  const avgSize = totalItems
    ? Math.round(
        items.reduce((sum, item) => sum + (item.size ?? 0), 0) / totalItems
      )
    : 0;

  const uniqueVarieties = new Set(items.map((i) => i.variety)).size;

  const highlightItem = useMemo(() => {
    if (!items.length) {
      return {
        id: 0,
        name: "No items yet",
        variety: "—",
        size: 0,
        gender: "—",
      };
    }

    return items.reduce((largest, current) => {
      const a = current.size ?? 0;
      const b = largest.size ?? 0;
      return a > b ? current : largest;
    }, items[0]);
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = [...items];

    if (search.trim()) {
      list = list.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (variety !== "all") {
      list = list.filter((item) => item.variety === variety);
    }

    switch (sort) {
      case "az":
        list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      case "za":
        list.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
        break;
      case "size-asc":
        list.sort((a, b) => (a.size ?? 0) - (b.size ?? 0));
        break;
      case "size-desc":
        list.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
        break;
    }

    return list;
  }, [items, search, variety, sort]);

  const varietyOptions = Array.from(
    new Set(items.map((i) => i.variety).filter(Boolean))
  ).sort();

  const placeholderImage = "/placeholder.svg";
  const hasItems = filteredItems.length > 0;

  const resolveImage = (item: itemsEntity) => {
    const sources = item.media ?? item.images ?? [];
    const media = sources.find(
      (m) => typeof m?.url === "string" && Boolean(m?.url)
    );
    return media?.url ?? item.primaryImage ?? placeholderImage;
  };

  /* -----------------------------------------------------------
   * RENDER
   * --------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Inventaris
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Item Saya</h1>
          <p className="text-sm text-muted-foreground">
            Jaga daftar koi kamu tetap rapi sebelum sesi lelang dimulai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/auctions">
              <Sparkles className="size-4" />
              Hubungkan ke Lelang
            </a>
          </Button>

          <Button className="gap-2" asChild>
            <a href="/dashboard/seller/items/create">
              <Plus className="size-4" />
              Item Baru
            </a>
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Item</p>
              <p className="text-2xl font-semibold">{totalItems}</p>
              <p className="text-xs text-muted-foreground">
                Siap dipromosikan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Scale className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ukuran Rata-rata</p>
              <p className="text-2xl font-semibold">{avgSize} cm</p>
              <p className="text-xs text-muted-foreground">
                Dari seluruh koleksi
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sebaran Varietas</p>
              <p className="text-2xl font-semibold">{uniqueVarieties}</p>
              <p className="text-xs text-muted-foreground">
                Jumlah garis keturunan unik
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIGHLIGHT */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              Item Sorotan
              <Badge variant="secondary" className="rounded-full">
                Terbesar
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="text-lg font-semibold">{highlightItem.name}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs">Ukuran</p>
                <p className="font-semibold">{highlightItem.size ?? 0} cm</p>
              </div>
              <div>
                <p className="text-xs">Varietas</p>
                <p className="font-semibold">{highlightItem.variety}</p>
              </div>
              <div>
                <p className="text-xs">Jenis Kelamin</p>
                <p className="font-semibold">{highlightItem.gender ?? "—"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() =>
                  router.push(`/dashboard/seller/items/${highlightItem.id}`)
                }
              >
                Lihat Detail
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  router.push(
                    `/dashboard/seller/items/${highlightItem.id}/edit`
                  )
                }
              >
                Edit Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FILTERS */}
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Cari nama koi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={variety} onValueChange={setVariety}>
              <SelectTrigger>
                <SelectValue placeholder="Filter varietas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua varietas</SelectItem>
                {varietyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">Nama A → Z</SelectItem>
                <SelectItem value="za">Nama Z → A</SelectItem>
                <SelectItem value="size-asc">Ukuran kecil → besar</SelectItem>
                <SelectItem value="size-desc">Ukuran besar → kecil</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* VIEW MODE TOGGLE */}
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Tampilan</CardTitle>
          </CardHeader>

          <CardContent className="flex gap-3">
            {VIEW_STATES.map((state) => (
              <Button
                key={state}
                variant={viewMode === state ? "secondary" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setViewMode(state)}
              >
                {state === "grid" ? (
                  <LayoutGrid className="size-4" />
                ) : (
                  <Rows3 className="size-4" />
                )}
                {state === "grid" ? "Grid" : "Daftar"}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ITEM LIST */}
      {isLoading && !hasItems ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : hasItems ? (
        viewMode === "grid" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={{
                  id: item.id,
                  name: item.name,
                  variety: item.variety ?? "Tidak diketahui",
                  size: item.size ?? 0,
                  age: item.age ?? "Unknown",
                  gender: item.gender,
                  status: item.isSold ? "sold" : "for-sale",
                  openBid: item.startingBid ?? undefined,
                  image: resolveImage(item),
                }}
                onEdit={() => router.push(`/dashboard/seller/items/${item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ItemRow
                key={item.id}
                item={{
                  id: item.id,
                  name: item.name,
                  size: item.size ?? 0,
                  variety: item.variety ?? "Tidak diketahui",
                  status: item.isSold ? "Sold" : "Active",
                  image: resolveImage(item),
                }}
                onEdit={() => router.push(`/dashboard/seller/items/${item.id}`)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border-dashed border px-6 py-10 text-center text-sm text-muted-foreground">
          Belum ada item. Gunakan tombol di atas untuk menambahkan koi ke inventaris.
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && hasItems && (
        <div className="flex items-center justify-center">
          <Spinner className="size-6" />
        </div>
      )}
    </div>
  );
}
