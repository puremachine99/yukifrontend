"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ItemGallery } from "@/components/item/item-gallery";
import { DeleteItemDialog } from "@/components/auction/delete-item-dialog";
import { Pencil, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { CancelError } from "@/lib/api-client/core/CancelablePromise";
import { configureApiClient } from "@/lib/api-client/configure";
import { ItemsService } from "@/lib/api-client/services/ItemsService";
import { useAuthSession } from "@/hooks/use-auth-session";

type Item = any; // backend auto-typed, entity sudah ga dipakai
type ItemMedia = { id?: number; url?: string | null; type?: string | null };

const normalizeMediaResponse = (payload: unknown): ItemMedia[] => {
  if (Array.isArray(payload)) return payload as ItemMedia[];

  if (payload && typeof payload === "object") {
    const r = payload as Record<string, unknown>;
    return (
      (Array.isArray(r.media) && (r.media as ItemMedia[])) ||
      (Array.isArray(r.data) && (r.data as ItemMedia[])) ||
      (Array.isArray(r.items) && (r.items as ItemMedia[])) ||
      []
    );
  }

  return [];
};

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken } = useAuthSession();

  const [item, setItem] = useState<Item | null>(null);
  const [itemMedia, setItemMedia] = useState<ItemMedia[]>([]);
  const [auctionHistory, setAuctionHistory] = useState<any[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------------------
   * FETCH ITEM + MEDIA + AUCTION HISTORY
   * ----------------------------------------------------------- */
  useEffect(() => {
    if (!params?.id) {
      setLoading(false);
      setError("Item tidak ditemukan.");
      return;
    }

    configureApiClient(accessToken ?? undefined);

    const detailReq = ItemsService.itemsControllerFindOne(String(params.id));
    const mediaReq = ItemsService.itemsControllerGetMedia(String(params.id));
    const historyReq = ItemsService.itemsControllerGetAuctionHistory(
      String(params.id)
    );

    Promise.all([detailReq, mediaReq, historyReq])
      .then(([detail, mediaRes, history]) => {
        setItem(detail);
        setItemMedia(normalizeMediaResponse(mediaRes));
        setAuctionHistory(Array.isArray(history) ? history : []);
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(err instanceof Error ? err.message : "Gagal memuat item");
      })
      .finally(() => setLoading(false));

    return () => {
      detailReq.cancel?.();
      mediaReq.cancel?.();
      historyReq.cancel?.();
    };
  }, [accessToken, params?.id]);

  /* -------------------------------------------------------------
   * COMPUTED GALLERY IMAGES
   * ----------------------------------------------------------- */
  const galleryImages = useMemo(() => {
    const sources = [
      ...(itemMedia ?? []),
      ...(item?.media ?? []),
      ...(item?.images ?? []),
    ];

    const urls = sources
      .map((m) => m?.url)
      .filter((u): u is string => Boolean(u));

    if (item?.primaryImage) urls.push(item.primaryImage);

    return urls.length ? Array.from(new Set(urls)) : ["/placeholder.svg"];
  }, [item, itemMedia]);

  const isLocked = useMemo(
    () => item?.isSold || item?.status?.toLowerCase() === "sold",
    [item]
  );

  /* -------------------------------------------------------------
   * DELETE ITEM
   * ----------------------------------------------------------- */
  const handleDelete = async () => {
    if (!accessToken || !item) {
      toast.error("Harap login ulang.");
      return;
    }

    setIsDeleting(true);
    configureApiClient(accessToken);

    try {
      await ItemsService.itemsControllerRemove(String(item.id));
      toast.success("Item berhasil dihapus");
      router.push("/dashboard/seller/items");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  /* -------------------------------------------------------------
   * LOADING / ERROR
   * ----------------------------------------------------------- */
  if (loading)
    return (
      <div className="flex min-h-[300px] justify-center items-center">
        <Spinner className="size-8" />
      </div>
    );

  if (error || !item)
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-8 text-center text-sm text-destructive">
        {error ?? "Item tidak ditemukan."}
      </div>
    );

  /* -------------------------------------------------------------
   * UI
   * ----------------------------------------------------------- */
  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-sm text-muted-foreground">ID Item: #{item.id}</p>

          {isLocked && (
            <Badge variant="destructive" className="mt-2 flex gap-1">
              <Lock className="size-3" /> Item Terjual – Terkunci
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                disabled={isLocked}
                onClick={() =>
                  router.push(`/dashboard/seller/items/${item.id}/edit`)
                }
              >
                <Pencil className="size-4" /> Edit
              </Button>
            </TooltipTrigger>
            {isLocked && (
              <TooltipContent>Item sudah terjual.</TooltipContent>
            )}
          </Tooltip>

          <Button
            variant="destructive"
            disabled={isLocked || isDeleting}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" /> Hapus
          </Button>
        </div>
      </div>

      {/* BODY */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-1">
          <ItemGallery images={galleryImages} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-8">
          {/* DETAILS CARD */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Detail Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Varietas</div>
                <div className="font-medium">{item.variety}</div>

                <div className="text-muted-foreground">Ukuran</div>
                <div className="font-medium">{item.size} cm</div>

                <div className="text-muted-foreground">Usia</div>
                <div className="font-medium">{item.age}</div>

                <div className="text-muted-foreground">Jenis kelamin</div>
                <div className="font-medium">{item.gender}</div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-1">Deskripsi</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AUCTION HISTORY */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Riwayat Lelang</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {auctionHistory.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum pernah ikut lelang.
                </p>
              )}

              {auctionHistory.map((a) => (
                <div
                  key={a.auctionId}
                  className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.startedAt
                        ? new Date(a.startedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    {a.highestBid ? (
                      <p className="text-sm font-medium">
                        Highest Bid:{" "}
                        <span className="font-semibold text-green-600">
                          Rp {Number(a.highestBid).toLocaleString()}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Belum ada bid
                      </p>
                    )}

                    <Badge
                      variant={
                        a.status === "finished" ? "default" : "outline"
                      }
                      className="uppercase text-xs"
                    >
                      {a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteItemDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={item.name}
      />
    </div>
  );
}
