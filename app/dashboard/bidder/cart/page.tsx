"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";

const addressOptions = [
  {
    id: "addr-1",
    label: "Primary Residence — Jakarta Selatan",
    detail: "Jalan Kemang Raya No. 12, Jakarta Selatan",
  },
  {
    id: "addr-2",
    label: "Farm Pickup — Bandung",
    detail: "Jl. Raya Lembang KM 5, Bandung",
  },
];

export default function BidderCartPage() {
  const { accessToken } = useAuthSession();
  const [items, setItems] = useState<
    Array<{
      id: string;
      title: string;
      seller: string;
      winPrice: number;
      deadline: string;
      status: string;
    }>
  >([]);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wonCartItems");
      const parsed = stored ? JSON.parse(stored) : [];
      setItems(parsed);
    } catch {
      setItems([]);
    }
  }, []);

  const payItem = async (id: string) => {
    if (!accessToken) {
      toast.error("Masuk untuk membayar.");
      return;
    }

    setPayingId(id);
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

    try {
      const res = await fetch(`${apiBase}/cart/${id}/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal membuat pembayaran");
      }

      const payload = (await res.json()) as { checkoutUrl?: string; invoiceId?: string };
      if (!payload.checkoutUrl) {
        throw new Error("URL pembayaran tidak ditemukan.");
      }

      toast.success("Mengalihkan ke pembayaran…");
      window.location.href = payload.checkoutUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat pembayaran");
    } finally {
      setPayingId(null);
    }
  };

  const cartItems = useMemo(() => {
    return items.map((item) => {
      const deadline = new Date(item.deadline);
      const diffHours = Math.max(
        0,
        Math.floor((deadline.getTime() - Date.now()) / (60 * 60 * 1000))
      );
      return {
        ...item,
        expiresInHours: diffHours,
        deadlineLabel: deadline.toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [items]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Checkout Cart
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Pending Payments</h1>
          <p className="text-sm text-muted-foreground">
            Winners have 3 days to settle payment or the bid is revoked.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Payment Window</CardTitle>
          <CardDescription>
            Pay within 72 hours. Late payment = ban & bid cancellation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border p-4 space-y-3 hover:border-primary/40 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{item.id}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Seller • {item.seller}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {item.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Win Price</p>
                  <p className="font-semibold">Rp {item.winPrice.toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Deadline</p>
                  <p className="font-semibold">{item.deadlineLabel}</p>
                </div>
              </div>

              <Progress value={((72 - item.expiresInHours) / 72) * 100} />
              <div className="text-xs text-muted-foreground">
                {item.expiresInHours} jam tersisa sebelum dibatalkan
              </div>

              <Button
                className="w-full"
                onClick={() => payItem(item.id)}
                disabled={!!payingId}
              >
                {payingId === item.id ? "Memproses..." : "Checkout"}
              </Button>
            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="rounded-2xl border-dashed border p-8 text-center text-sm text-muted-foreground">
              Nothing to pay. Menangkan bid atau Buy Now untuk muncul di sini.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-muted/40">
        <CardHeader>
          <CardTitle>Penalty Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Unpaid carts after 72h → bid revoked + 7-day suspension.</p>
          <p>• Repeat offenders → permanent ban.</p>
          <p>• Payments trigger shipment workflow automatically.</p>
        </CardContent>
      </Card>
    </div>
  );
}
