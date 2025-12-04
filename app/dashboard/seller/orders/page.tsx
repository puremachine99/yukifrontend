"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/hooks/use-auth-session";
import { formatCurrencyIDR } from "@/lib/utils/currency";
import { toast } from "sonner";

type SellerOrder = {
  id: number;
  totalAmount: number;
  status: string;
  paidAt?: string | null;
  createdAt: string;
  cart?: {
    id: number;
    itemOnAuction?: {
      id: number;
      item?: {
        id?: number;
        name?: string | null;
        variety?: string | null;
        size?: number | string | null;
        media?: Array<{ url?: string | null }>;
      };
      auction?: { id?: number; title?: string | null };
    };
  };
  buyer?: { id?: number; name?: string | null; email?: string | null };
};

export default function SellerOrdersPage() {
  const { accessToken, isAuthenticated } = useAuthSession();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
        ).replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/transaction/seller/orders`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(
            `Gagal memuat pesanan (${res.status})${body ? `: ${body}` : ""}`
          );
        }
        const data = (await res.json()) as SellerOrder[];
        setOrders(data ?? []);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Gagal memuat pesanan";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [accessToken, isAuthenticated]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        const da = a.paidAt ?? a.createdAt;
        const db = b.paidAt ?? b.createdAt;
        return new Date(db).getTime() - new Date(da).getTime();
      }),
    [orders]
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Seller • Fulfillment
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Pesanan dari pemenang lelang yang harus dikirim ke buyer.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Spinner className="size-5" />
          Memuat pesanan...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          Belum ada pesanan dari lelang.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {sortedOrders.map((order) => {
            const item = order.cart?.itemOnAuction?.item;
            const auction = order.cart?.itemOnAuction?.auction;
            const image =
              item?.media?.find((m) => m?.url)?.url ?? "/placeholder.svg";
            return (
              <Card key={order.id} className="rounded-2xl border">
                <CardHeader className="pb-2">
                  <CardTitle>{item?.name ?? `Transaksi #${order.id}`}</CardTitle>
                  <CardDescription className="space-y-1">
                    <span>
                      Buyer: {order.buyer?.name ?? order.buyer?.email ?? "N/A"}
                    </span>
                    {auction?.title ? (
                      <div>
                        Auction:{" "}
                        <Link
                          href={`/auction/${auction.id}`}
                          className="underline"
                        >
                          {auction.title}
                        </Link>
                      </div>
                    ) : null}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Dibayar pada{" "}
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleString("id-ID")
                        : "-"}
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <div className="rounded-xl border overflow-hidden">
                    <img
                      src={image}
                      alt={item?.name ?? "Item"}
                      className="h-40 w-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Total</p>
                      <p className="font-semibold">
                        {formatCurrencyIDR(Number(order.totalAmount ?? 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Varietas</p>
                      <p className="font-semibold">
                        {item?.variety ?? "–"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>ID Transaksi #{order.id}</span>
                    {order.cart?.id ? <span>Cart #{order.cart.id}</span> : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
