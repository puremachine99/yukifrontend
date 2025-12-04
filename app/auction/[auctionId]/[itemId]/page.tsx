"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { LandingNavbar } from "@/components/landing/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { ChatService } from "@/lib/api-client/services/ChatService";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";
import { formatCurrencyIDR } from "@/lib/utils/currency";
import { useAuthSession } from "@/hooks/use-auth-session";

import { CornerDownRight, Reply, Trash2, Send, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
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

const formatCountdown = (target?: string | null) => {
  if (!target) return "--:--";
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return "Selesai";
  const hours = Math.floor(diff / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((diff / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((diff / 1000) % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

type LiveRoomAuction = {
  id: number;
  title: string;
  description?: string | null;
  status?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  user?: { id?: number; name?: string | null; avatar?: string | null };
  items?: Array<LiveRoomLot>;
};

type LiveRoomLot = {
  id: number;
  itemId: number;
  openBid?: number;
  increment?: number;
  buyNow?: number | null;
  status?: string | null;
  bids?: Array<{
    id?: number;
    amount?: number;
    createdAt?: string;
    user?: { id?: number; name?: string | null };
  }>;
  item?: {
    id?: number;
    name?: string;
    variety?: string;
    size?: number | string | null;
    media?: Array<{ url?: string | null }>;
  };
};

type ChatMessage = {
  id: number;
  message: string;
  createdAt?: string;
  parentId?: number | null;
  itemOnAuctionId?: number;
  user?: { id?: number; name?: string | null; avatar?: string | null };
};

type VisitorUser = {
  id?: number;
  name?: string | null;
  avatar?: string | null;
};

const normalizeAuction = (payload: unknown): LiveRoomAuction | null => {
  if (!payload || typeof payload !== "object") return null;
  return payload as LiveRoomAuction;
};

const normalizeChats = (payload: unknown): ChatMessage[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as ChatMessage[];
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as ChatMessage[];
  }
  return [];
};

const upsertVisitor = (
  visitors: VisitorUser[],
  next: VisitorUser | null | undefined
) => {
  if (!next) return visitors;
  const idKey = next.id ? String(next.id) : next.name ?? null;
  if (!idKey) return visitors;
  const filtered = visitors.filter((v) =>
    v.id ? String(v.id) !== idKey : v.name !== idKey
  );
  return [...filtered, next];
};

export default function AuctionLiveRoomPage() {
  const params = useParams<{ auctionId: string; itemId: string }>();
  const auctionId = Number(
    Array.isArray(params?.auctionId) ? params?.auctionId[0] : params?.auctionId
  );
  const itemId = Number(
    Array.isArray(params?.itemId) ? params?.itemId[0] : params?.itemId
  );
  const { accessToken, user } = useAuthSession();
  const parseErrorMessage = async (res: Response) => {
    try {
      const data = await res.json();
      if (data?.message) {
        return Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
      }
    } catch {
      /* ignore json parse */
    }
    try {
      const text = await res.text();
      if (text) return text;
    } catch {
      /* ignore text parse */
    }
    return "Permintaan gagal.";
  };

  const [auction, setAuction] = useState<LiveRoomAuction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auctionEnd, setAuctionEnd] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("--:--");

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidCode, setBidCode] = useState("");
  const [bidCodeKey, setBidCodeKey] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [isBidSubmitting, setIsBidSubmitting] = useState(false);
  const [isBuyNowSubmitting, setIsBuyNowSubmitting] = useState(false);
  const [isBuyNowConfirmOpen, setIsBuyNowConfirmOpen] = useState(false);
  const [buyNowConfirmText, setBuyNowConfirmText] = useState("");

  const auctionSocketRef = useRef<Socket | null>(null);
  const chatSocketRef = useRef<Socket | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [visitors, setVisitors] = useState<VisitorUser[]>([]);
  const [isVisitorPanelOpen, setIsVisitorPanelOpen] = useState(false);
  const visitorCount = visitors.length;

  useEffect(() => {
    if (!auctionId) {
      setError("Auction tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    configureApiClient(accessToken ?? undefined);
    setIsLoading(true);
    setError(null);

    const request = AuctionService.auctionControllerGetLiveRoom(auctionId);
    request
      .then((response) => {
        const detail = normalizeAuction(response);
        setAuction(detail);
        setAuctionEnd(detail?.endTime ?? null);
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(
          err instanceof Error ? err.message : "Gagal memuat live room."
        );
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (typeof request.cancel === "function") request.cancel();
    };
  }, [auctionId, accessToken]);

  const lot = useMemo(() => {
    if (!auction) return null;
    return auction.items?.find((entry) => entry.itemId === itemId) ?? null;
  }, [auction, itemId]);

  const lotUniqueId = useMemo(() => {
    return lot?.id ? Number(lot.id) : null;
  }, [lot?.id]);
  const socketDeps = useMemo(
    () => [accessToken, auctionId, lotUniqueId, user?.id ?? null] as const,
    [accessToken, auctionId, lotUniqueId, user?.id]
  );

  const highestBid = useMemo(() => {
    if (!lot) return 0;
    if (!lot.bids || lot.bids.length === 0) return Number(lot.openBid ?? 0);
    return Math.max(...lot.bids.map((bid) => Number(bid.amount ?? 0)));
  }, [lot]);

  const bidCount = lot?.bids?.length ?? 0;

  const minBid = useMemo(() => {
    if (!lot) return 0;
    const openBid = Number(lot.openBid ?? 0);
    const increment = Number(lot.increment ?? 0);
    if (!lot.bids || lot.bids.length === 0) {
      return openBid;
    }
    return highestBid + increment;
  }, [lot, highestBid]);

  useEffect(() => {
    if (minBid > 0) {
      setBidAmount(minBid);
    }
  }, [minBid]);

  useEffect(() => {
    if (!auctionEnd) {
      setTimeLeft("--:--");
      return;
    }
    const update = () => setTimeLeft(formatCountdown(auctionEnd));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [auctionEnd]);

  useEffect(() => {
    if (!auctionId) return;
    setIsChatLoading(true);
    setChatError(null);
    configureApiClient(accessToken ?? undefined);

    const request = ChatService.chatControllerFindByAuction(String(auctionId));
    request
      .then((response) => setChatMessages(normalizeChats(response)))
      .catch((err) => {
        if (err instanceof CancelError) return;
        setChatError(err instanceof Error ? err.message : "Gagal memuat chat.");
      })
      .finally(() => setIsChatLoading(false));

    return () => {
      if (typeof request.cancel === "function") request.cancel();
    };
  }, [auctionId, accessToken]);

  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatMessages]);

  useEffect(() => {
    const [token, auctionIdValue, lotIdValue] = socketDeps;
    if (!token || !auctionIdValue || !lotIdValue) return;
    if (auctionSocketRef.current) {
      auctionSocketRef.current.disconnect();
      auctionSocketRef.current = null;
    }
    if (chatSocketRef.current) {
      chatSocketRef.current.disconnect();
      chatSocketRef.current = null;
    }
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");
    const wsHost = baseUrl.replace(/^http/, "ws");
    const presenceRoom = `presence-auction-${auctionIdValue}-item-${lotIdValue}`;

    const auctionSocket = io(`${wsHost}/auction`, {
      transports: ["websocket"],
      auth: { token },
    });
    auctionSocketRef.current = auctionSocket;
    auctionSocket.emit("subscribeAuction", { auctionId: auctionIdValue });

    const upsertBid = (payload: any) => {
      if (payload?.auctionId !== auctionIdValue) return;
      const targetId = payload?.itemOnAuctionId ?? payload?.itemId;
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: (prev.items ?? []).map((entry) => {
            if (entry.id !== targetId && entry.itemId !== targetId)
              return entry;
            const bids = [...(entry.bids ?? [])];
            if (payload?.bid) {
              const bidWithUser = payload.bid?.user
                ? payload.bid
                : {
                    ...payload.bid,
                    user: payload.user
                      ? { id: payload.user.id, name: payload.user.name }
                      : undefined,
                  };
              bids.push(bidWithUser);
            } else if (payload?.amount) {
              bids.push({
                id: Date.now(),
                amount: payload.amount,
                createdAt: new Date().toISOString(),
                user: payload?.user
                  ? { id: payload.user.id, name: payload.user.name }
                  : undefined,
              });
            }
            const status =
              payload?.bid?.isBuyNow || payload?.isBuyNow
                ? "sold"
                : entry.status;
            return { ...entry, bids, status };
          }),
        };
      });
    };

    auctionSocket.on("auction:bid", upsertBid);
    auctionSocket.on("bid:new", upsertBid);

    const handleBuyNow = (payload: any) => {
      if (payload?.auctionId !== auctionId) return;
      const targetId = payload?.itemOnAuctionId ?? payload?.itemId;
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: (prev.items ?? []).map((entry) =>
            entry.id === targetId || entry.itemId === targetId
              ? { ...entry, status: "sold" }
              : entry
          ),
        };
      });
    };

    auctionSocket.on("buyNow", handleBuyNow);
    auctionSocket.on("auction:buyNow", handleBuyNow);

    auctionSocket.on("auction:extended", (payload: any) => {
      if (payload?.auctionId !== auctionIdValue) return;
      const end = payload?.endTime ?? payload?.newEndTime ?? null;
      setAuctionEnd(end);
      setAuction((prev) =>
        prev ? { ...prev, endTime: end ?? prev.endTime } : prev
      );
    });

    const chatSocket = io(`${wsHost}/chat`, {
      transports: ["websocket"],
      auth: { token },
    });
    chatSocketRef.current = chatSocket;
    chatSocket.emit("joinAuction", { auctionId: auctionIdValue });

    const visitPayload = { auctionId: auctionIdValue, itemOnAuctionId: lotIdValue };

    const emitVisit = () => chatSocket.emit("visitItem", visitPayload);
    const requestVisitorList = () =>
      chatSocket.emit("visitor:list", visitPayload);

    emitVisit();
    requestVisitorList();
    chatSocket.on("connect", () => {
      emitVisit();
      requestVisitorList();
    });

    const visitorPing = setInterval(() => {
      emitVisit();
      requestVisitorList();
    }, 15000);
    if (user) {
      setVisitors((prev) =>
        upsertVisitor(prev, {
          id: user.id,
          name: user.name,
          avatar: (user as any)?.avatar ?? null,
        })
      );
    }

    chatSocket.on("chatMessage", (message: ChatMessage) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    chatSocket.on("visitor:list", (payload: VisitorUser[] = []) => {
      if (!Array.isArray(payload)) return;
      const uniqueById = new Map<string, VisitorUser>();
      payload.forEach((entry) => {
        const key = entry?.id ? String(entry.id) : entry?.name;
        if (!key) return;
        uniqueById.set(key, entry);
      });
      setVisitors(Array.from(uniqueById.values()));
    });

    chatSocket.on("visitor:joined", (payload: VisitorUser) => {
      setVisitors((prev) => upsertVisitor(prev, payload));
    });

    chatSocket.on("visitor:left", (payload: VisitorUser) => {
      setVisitors((prev) => {
        const idKey = payload?.id ? String(payload.id) : payload?.name;
        if (!idKey) return prev;
        return prev.filter((v) =>
          v.id ? String(v.id) !== idKey : v.name !== idKey
        );
      });
    });

    chatSocket.on("error", (msg: any) => {
      console.error("CHAT SOCKET ERROR:", msg);
    });

    chatSocket.on("chatMessageDeleted", ({ id }: { id: number }) => {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== id));
    });

    return () => {
      auctionSocket.emit("unsubscribeAuction", { auctionId });
      auctionSocket.disconnect();
      chatSocket.disconnect();
      auctionSocketRef.current = null;
      chatSocketRef.current = null;
      chatSocket.off("connect");
      clearInterval(visitorPing);
    };
  }, [accessToken, auctionId, lotUniqueId, user]);

  const galleryImages = useMemo(() => {
    return lot?.item?.media?.map((media) => media?.url).filter(Boolean) ?? [];
  }, [lot]);

  const bidHistory = useMemo(() => lot?.bids ?? [], [lot]);

  const isSold = (lot?.status ?? "").toLowerCase() === "sold";
  const incrementAmount = Number(lot?.increment ?? 0);
  const isViewOnly = !accessToken;
  const mediaList = useMemo(() => {
    const list = lot?.item?.media ?? [];
    return list.map((m, idx) => ({
      key: m?.url ?? idx.toString(),
      url: m?.url ?? "/placeholder.svg",
      isVideo: Boolean(m?.url && m.url.match(/\.(mp4|mov|webm)$/i)),
    }));
  }, [lot]);

  useEffect(() => {
    setMediaIndex(0);
  }, [lot?.id]);

  const handlePlaceBid = async () => {
    if (!lot) return;
    if (!accessToken) {
      toast.error("Masuk terlebih dahulu untuk melakukan bid.");
      return;
    }
    if (Number(bidAmount) < minBid) {
      toast.error(`Minimal bid Rp ${formatCurrencyIDR(minBid)}`);
      return;
    }
    if (bidCode.trim() !== bidCodeKey) {
      toast.error("Kode verifikasi tidak cocok.");
      setBidCodeKey(Math.floor(1000 + Math.random() * 9000).toString());
      setBidCode("");
      return;
    }

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");

    setIsBidSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/auction/${auctionId}/${lot.id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: Number(bidAmount),
          isBuyNow: false,
        }),
      });
      if (!res.ok) {
        const msg = await parseErrorMessage(res);
        throw new Error(msg || "Bid gagal.");
      }
      toast.success("Bid dikirim.");
      auctionSocketRef.current?.emit("subscribeAuction", { auctionId });
      setBidCodeKey(Math.floor(1000 + Math.random() * 9000).toString());
      setBidCode("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bid gagal.");
    } finally {
      setIsBidSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!lot) return;
    if (!accessToken) {
      toast.error("Masuk terlebih dahulu untuk membeli langsung.");
      return;
    }
    if (!lot.buyNow) {
      toast.error("Buy now tidak tersedia.");
      return;
    }
    if (buyNowConfirmText.trim().toLowerCase() !== "yakin") {
      toast.error('Ketik "Yakin" untuk melanjutkan Buy Now.');
      return;
    }

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");

    setIsBuyNowSubmitting(true);
    try {
      const res = await fetch(
        `${baseUrl}/auction/${auctionId}/${lot.id}/buy-now`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: Number(lot.buyNow),
            isBuyNow: true,
          }),
        }
      );
      if (!res.ok) {
        const msg = await parseErrorMessage(res);
        throw new Error(msg || "Buy Now gagal.");
      }
      toast.success("Item dibeli dengan Buy Now.");
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: (prev.items ?? []).map((entry) =>
            entry.itemId === lot.itemId ? { ...entry, status: "sold" } : entry
          ),
        };
      });
      try {
        const existing = localStorage.getItem("wonCartItems");
        const parsed: any[] = existing ? JSON.parse(existing) : [];
        const newItem = {
          id: `CART-${lot.id}`,
          auctionId,
          itemId: lot.itemId,
          title: lot.item?.name ?? `Lot #${lot.itemId}`,
          seller: auction?.user?.name ?? "Unknown Seller",
          winPrice: Number(lot.buyNow ?? lot.openBid ?? 0),
          status: "UNPAID",
          deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem("wonCartItems", JSON.stringify([...parsed, newItem]));
      } catch {
        // ignore storage errors
      }
      setIsBuyNowConfirmOpen(false);
      setBuyNowConfirmText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Buy Now gagal.");
    } finally {
      setIsBuyNowSubmitting(false);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !accessToken) return;

    chatSocketRef.current?.emit("sendMessage", {
      auctionId,
      itemOnAuctionId: lotUniqueId,
      message: chatInput.trim(),
      parentId: replyTo?.id,
    });

    setChatInput("");
    setReplyTo(null);
  };

  const handleDeleteChat = async (messageId: number) => {
    if (!accessToken) {
      toast.error("Masuk untuk menghapus pesan.");
      return;
    }

    try {
      configureApiClient(accessToken);
      await ChatService.chatControllerRemove(String(messageId));
      toast.success("Pesan dihapus.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus pesan."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
            {error}
          </div>
        ) : !auction || !lot ? (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
            Lot tidak ditemukan pada auction ini.
          </div>
        ) : (
          <>
            {/* =========================== */}
            {/* Header Auction              */}
            {/* =========================== */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
                <span>Auction #{auction.id}</span>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/40 text-white"
                >
                  {auction.status ?? "ACTIVE"}
                </Badge>
              </div>

              <h1 className="text-3xl font-semibold">{auction.title}</h1>
              <p className="text-slate-300 max-w-3xl">
                {auction.description ?? "Auction ini sedang berlangsung."}
              </p>
              {auction.user ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={auction.user.avatar ?? undefined} />
                    <AvatarFallback>
                      {(auction.user.name ?? "AU")
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    {auction.user.id ? (
                      <Link
                        href={`/u/${auction.user.id}`}
                        className="font-semibold text-foreground hover:underline"
                      >
                        {auction.user.name ?? "Pemilik lelang"}
                      </Link>
                    ) : (
                      <span className="font-semibold text-foreground">
                        {auction.user.name ?? "Pemilik lelang"}
                      </span>
                    )}
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Pemilik lelang
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* MAIN GRID                   */}
            <div className="grid gap-8 lg:grid-cols-12 lg:auto-rows-fr">
              {/* ===================================== */}
              {/* COLUMN 1 — MEDIA (4 cols)             */}
              {/* ===================================== */}
              <section className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col h-full">
                  {/* Big Slider */}
                  <div className="relative bg-black/20 h-[520px] lg:h-[760px]">
                    {mediaList.length === 0 ? (
                      <img
                        src="/placeholder.svg"
                        alt={lot.item?.name ?? "Koi preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <div
                          className="flex h-full w-full transition-transform duration-500"
                          style={{
                            transform: `translateX(-${mediaIndex * 100}%)`,
                          }}
                        >
                          {mediaList.map((media, idx) => (
                            <div
                              key={media.key}
                              className="w-full shrink-0 h-full"
                            >
                              {media.isVideo ? (
                                <video
                                  src={media.url}
                                  controls
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img
                                  src={media.url}
                                  alt={`${lot.item?.name ?? "Koi"}-${idx + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Controls */}
                        {mediaList.length > 1 && (
                          <>
                            <button
                              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-white"
                              onClick={() =>
                                setMediaIndex((prev) =>
                                  prev === 0 ? mediaList.length - 1 : prev - 1
                                )
                              }
                            >
                              ‹
                            </button>
                            <button
                              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-white"
                              onClick={() =>
                                setMediaIndex((prev) =>
                                  prev === mediaList.length - 1 ? 0 : prev + 1
                                )
                              }
                            >
                              ›
                            </button>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {mediaList.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`h-3 w-3 rounded-full ${
                                    idx === mediaIndex
                                      ? "bg-white"
                                      : "bg-white/40"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* ===================================== */}
              {/* COLUMN 2 — BID HISTORY + BID CONTROL (4 cols) */}
              {/* ===================================== */}
              <section className="lg:col-span-4 space-y-6">
                <Card className="rounded-3xl border border-border bg-card h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      Bid History {timeLeft}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Update realtime setiap bid masuk.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Bid History List */}
                    <div className="space-y-3 overflow-y-auto pr-2 max-h-[320px]">
                      {bidHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Belum ada bid. Jadilah yang pertama!
                        </p>
                      ) : (
                        bidHistory
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt ?? 0).getTime() -
                              new Date(a.createdAt ?? 0).getTime()
                          )
                          .map((bid, index) => {
                            const isTop = index === 0;

                            return (
                              <div
                                key={bid.id ?? `${bid.amount}-${bid.createdAt}`}
                                className={`
              rounded-2xl border px-3 py-2 text-sm transition
              ${
                isTop
                  ? "border-secondary/60 bg-secondary/10 shadow-sm"
                  : "border-border"
              }
            `}
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`
                  font-semibold truncate
                  ${isTop ? "text-secondary" : ""}
                `}
                                  >
                                    {formatCurrencyIDR(Number(bid.amount ?? 0))}
                                  </span>

                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDateTime(bid.createdAt)}
                                  </span>
                                </div>

                                <p className="text-xs text-muted-foreground truncate">
                                  Bidder: {bid.user?.name ?? "Anonim"}
                                </p>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border my-2"></div>

                    {/* Bid Control Panel */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Highest Bid</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrencyIDR(highestBid)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Total Bids</span>
                        <span className="font-semibold text-foreground">
                          {bidCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={minBid}
                          value={bidAmount}
                          disabled={!accessToken || isSold}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                        />
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setBidAmount(
                              (prev) => Number(prev || minBid) + incrementAmount
                            )
                          }
                          disabled={!accessToken || isSold}
                        >
                          +{formatCurrencyIDR(incrementAmount)}
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2 text-xs text-slate-300">
                        <span>Kode:</span>
                        <div className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 font-semibold tracking-widest text-white">
                          {bidCodeKey}
                        </div>

                        <Input
                          value={bidCode}
                          disabled={!accessToken || isSold}
                          onChange={(e) => setBidCode(e.target.value)}
                          placeholder="Masukkan kode di atas"
                          className="h-9"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={handlePlaceBid}
                          disabled={!accessToken || isBidSubmitting || isSold}
                        >
                          {isBidSubmitting ? "Mengirim…" : "Bid Sekarang"}
                        </Button>

                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setIsBuyNowConfirmOpen(true)}
                          disabled={
                            !accessToken || !lot.buyNow || isBuyNowSubmitting
                          }
                        >
                          {isBuyNowSubmitting ? "..." : "Buy Now"}
                        </Button>
                      </div>

                      {isViewOnly && (
                        <p className="text-xs text-amber-200/90">
                          Masuk untuk bid & buy now. Mode lihat saja.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* ===================================== */}
              {/* COLUMN 3 — INFO KOI + CHAT (4 cols)   */}
              {/* ===================================== */}
              <section className="lg:col-span-4 space-y-6">
                {/* Info Koi */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
                  <p className="text-sm text-slate-400">Lot #{lot.itemId}</p>

                  {/* Title + Sold badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-semibold leading-tight">
                      {lot.item?.name ?? "Koi Tanpa Nama"}
                    </h2>

                    {isSold && (
                      <Badge className="bg-rose-600 text-white">SOLD</Badge>
                    )}
                  </div>

                  {/* Variety */}
                  <p className="text-sm text-slate-300">
                    {lot.item?.variety ?? "Varietas tidak diketahui"} •{" "}
                    {lot.item?.size ?? "-"} cm
                  </p>

                  {/* Price Grid — more width + responsive text */}
                  <div className="grid sm:grid-cols-3 gap-5 pt-3 text-sm text-muted-foreground">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[11px] uppercase">Open Bid</p>
                      <p className="font-semibold text-[17px] truncate leading-tight">
                        {formatCurrencyIDR(Number(lot.openBid ?? 0))}
                      </p>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <p className="text-[11px] uppercase">Increment</p>
                      <p className="font-semibold text-[17px] truncate leading-tight">
                        {formatCurrencyIDR(Number(lot.increment ?? 0))}
                      </p>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <p className="text-[11px] uppercase">Buy Now</p>
                      <p className="font-semibold text-[17px] truncate leading-tight">
                        {lot.buyNow
                          ? formatCurrencyIDR(Number(lot.buyNow))
                          : "Tidak tersedia"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Panel */}
                <Card className="rounded-3xl border border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>Live Chat</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Diskusi dan pertanyaan langsung.
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsVisitorPanelOpen(true)}
                      >
                        <Users className="size-4" />
                        {visitorCount}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* CHAT LIST */}
                    <div
                      ref={chatListRef}
                      className="space-y-2 max-h-[420px] min-h-[420px] overflow-y-auto pr-2"
                    >
                      {isChatLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Spinner className="size-5" />
                        </div>
                      ) : chatError ? (
                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                          {chatError}
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <p className="text-sm text-slate-300">
                          Belum ada percakapan.
                        </p>
                      ) : (
                        chatMessages.map((message) => {
                          const isOwner =
                            message.user?.id && message.user.id === user?.id;

                          const replySource = message.parentId
                            ? chatMessages.find(
                                (m) => m.id === message.parentId
                              )
                            : null;

                          return (
                            <div
                              key={
                                message.id ??
                                `${message.message}-${message.createdAt}`
                              }
                              className={`flex gap-2 items-start ${
                                isOwner ? "justify-end" : "justify-start"
                              }`}
                            >
                              {!isOwner && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={message.user?.avatar ?? undefined}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {(message.user?.name ?? "A")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div
                                className={`max-w-[75%] rounded-lg px-3 py-2 text-xs shadow-sm ${
                                  isOwner
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "mr-auto bg-secondary text-secondary-foreground"
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] opacity-80">
                                  <span className="font-semibold truncate">
                                    {message.user?.name ?? "Anonim"}
                                  </span>
                                  <span>
                                    {formatDateTime(message.createdAt)}
                                  </span>
                                </div>

                                {replySource && (
                                  <div className="mt-1 text-[11px] opacity-80 flex items-start gap-2">
                                    <CornerDownRight className="size-3 mt-1 opacity-70" />
                                    <p className="italic line-clamp-2">
                                      {replySource.user?.name ?? "Anonim"}:{" "}
                                      {replySource.message}
                                    </p>
                                  </div>
                                )}

                                <p className="mt-1 text-sm whitespace-pre-line">
                                  {message.message}
                                </p>
                              </div>

                              {isOwner && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={message.user?.avatar ?? undefined}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {(message.user?.name ?? "A")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {isViewOnly && (
                      <p className="text-xs text-amber-200/90">
                        Masuk untuk mengirim pesan. Anda saat ini hanya melihat.
                      </p>
                    )}

                    {/* Reply Indicator */}
                    {replyTo && (
                      <div className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary flex items-center justify-between">
                        <span>Membalas {replyTo.user?.name ?? "Anonim"}</span>
                        <button
                          className="text-primary-foreground"
                          onClick={() => setReplyTo(null)}
                        >
                          Batal
                        </button>
                      </div>
                    )}

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={
                          accessToken
                            ? "Tulis pesan..."
                            : "Masuk untuk ikut chat"
                        }
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                        disabled={!accessToken}
                        className="bg-white/10 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={handleSendChat}
                        disabled={!accessToken || !chatInput.trim()}
                      >
                        <Send className="size-4 mr-2" /> Kirim
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* =========================== */}
            {/* Bid history bottom full width */}
            {/* =========================== */}
            <div
              className={`fixed inset-y-0 right-0 z-40 w-full max-w-sm transform bg-background/95 backdrop-blur-lg border-l border-border transition-transform duration-300 ${
                isVisitorPanelOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Pengunjung
                  </p>
                  <p className="text-lg font-semibold">
                    {visitorCount} user sedang melihat
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisitorPanelOpen(false)}
                >
                  Tutup
                </Button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-64px)]">
                {visitors.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Belum ada pengunjung lain yang terdeteksi.
                  </div>
                ) : (
                  visitors.map((visitor, idx) => (
                    <div
                      key={visitor.id ?? `${visitor.name}-${idx}`}
                      className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={visitor.avatar ?? undefined} />
                        <AvatarFallback className="text-[10px]">
                          {(visitor.name ?? "A").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {visitor.name ?? "Pengunjung"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {visitor.id ? `User #${visitor.id}` : "Tidak dikenal"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {isVisitorPanelOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
                onClick={() => setIsVisitorPanelOpen(false)}
              />
            )}
          </>
        )}
      </main>

      <AlertDialog
        open={isBuyNowConfirmOpen}
        onOpenChange={setIsBuyNowConfirmOpen}
      >
        <AlertDialogContent className="bg-slate-900 text-white border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Buy Now</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Ketik <span className="font-semibold text-white">Yakin</span>{" "}
              untuk melanjutkan Buy Now. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            autoFocus
            value={buyNowConfirmText}
            onChange={(e) => setBuyNowConfirmText(e.target.value)}
            placeholder='Ketik "Yakin"'
            className="bg-white/10 text-white placeholder:text-slate-500"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent text-slate-200 border border-white/20">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isBuyNowSubmitting}
              className="bg-primary text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                handleBuyNow();
              }}
            >
              {isBuyNowSubmitting ? "Memproses…" : "Konfirmasi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
