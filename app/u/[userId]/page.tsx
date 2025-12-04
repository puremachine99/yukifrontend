"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  DollarSign,
  Hammer,
  Star,
  Shield,
  BadgeCheck,
  Phone,
  Instagram,
  Youtube,
} from "lucide-react";

import { formatCurrencyIDR } from "@/lib/utils/currency";
import { UsersService } from "@/lib/api-client/services/UsersService";
import { configureApiClient } from "@/lib/api-client/configure";
import { ItemCard } from "@/components/item/item-card";

export default function ProfilePortfolio() {
  const params = useParams();
  const userId = Array.isArray(params?.userId)
    ? params.userId[0]
    : params?.userId;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"koi" | "auctions" | "stats">(
    "koi"
  );

  useEffect(() => {
    configureApiClient();
    if (!userId) {
      setLoading(false);
      return;
    }
    const replaceStorageHost = (url?: string | null) => {
      if (!url) return url;
      const publicHost =
        process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL ||
        process.env.NEXT_PUBLIC_MINIO_ENDPOINT ||
        "";
      if (!publicHost) return url;
      return url.replace("http://localhost:9000", publicHost);
    };

    UsersService.usersControllerGetPublicProfile(String(userId))
      .then((res) => {
        if (!res) return setProfile(res);
        const normalized = {
          ...res,
          avatar: replaceStorageHost(res.avatar),
          banner: replaceStorageHost(res.banner),
          items: (res.items || []).map((item: any) => ({
            ...item,
            media: (item.media || []).map((m: any) => ({
              ...m,
              url: replaceStorageHost(m.url),
            })),
          })),
        };
        setProfile(normalized);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const soldPriceOf = (item) => {
    const auc = item.auctions?.[0];
    const win = auc?.bids?.find((b) => b.isWin || b.isBuyNow);
    return win ? Number(win.amount) : null;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4.0) return "text-blue-500";
    if (rating >= 3.0) return "text-yellow-500";
    return "text-red-500";
  };

  const avatar = profile?.avatar?.trim()
    ? profile.avatar
    : "/placeholder.svg";
  const banner = profile?.banner?.trim()
    ? profile.banner
    : "/placeholder.svg";

  const showcase = profile?.items?.[0] ?? null;
  const items = profile?.items ?? [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Memuat portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Users className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">
            Profil tidak ditemukan
          </h2>
          <p className="text-muted-foreground">
            User dengan ID tersebut tidak dapat ditemukan
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border rounded-2xl shadow-sm p-6 relative overflow-visible">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={`${profile?.name}'s avatar`}
                    className="rounded-full w-32 h-32 object-cover border"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow">
                    <BadgeCheck className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">{profile?.name}</h1>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile?.farmName || profile?.farm_name || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.address ? `${profile.address}, ${profile.city ?? ""}` : profile?.city}
                  </p>
                </div>

                {/* Socials */}
                <div className="flex items-center gap-3 justify-center">
                  {profile?.phone && (
                    <a
                      href={`https://wa.me/${profile.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {profile?.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {profile?.youtube && (
                    <a
                      href={profile.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Follow counts */}
                <div className="flex items-center justify-center gap-6 pt-2">
                  {[{ label: "Followers", value: profile?._count?.followers }, { label: "Following", value: profile?._count?.following }].map(
                    ({ label, value }) => (
                      <div key={label} className="text-center">
                        <p className="text-lg font-bold">{value ?? 0}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    )
                  )}
                </div>

                {/* Rating */}
                <div className="w-full bg-muted/50 p-3 rounded-xl text-left space-y-1">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    Rating Penjual
                    {profile?.stats?.rating && (
                      <span className={`text-xs font-bold ${getRatingColor(profile.stats.rating)}`}>
                        {profile.stats.rating} ⭐
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile?.stats?.rating ? "Nilai dari pembeli" : "Belum ada rating"}
                  </p>
                </div>

                {/* Bio */}
                <div className="w-full bg-muted/40 p-4 rounded-xl text-left">
                  <p className="text-sm font-semibold">Bio</p>
                  <p className="text-sm text-muted-foreground italic">
                    {profile?.bio || "-"}
                  </p>
                </div>

                {/* Achievements */}
                {profile?.achievements?.length ? (
                  <div className="w-full space-y-3">
                    <p className="text-sm font-semibold">Achievement</p>
                    <div className="grid gap-2">
                      {profile.achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className="flex items-center p-2 rounded-lg border bg-muted/40"
                          style={{ backgroundColor: ach.badgeColor || undefined }}
                        >
                          <div className="w-1/4 flex justify-center border-r">
                            <i className={`fa-solid ${ach.icon} text-2xl text-slate-800`} />
                          </div>
                          <div className="w-3/4 pl-3">
                            <p className="text-sm font-semibold text-slate-800">
                              {ach.name}
                            </p>
                            <p className="text-xs text-slate-700 opacity-80">
                              {ach.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* Banner + name */}
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="relative h-52 w-full">
                <img src={banner} alt="banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/40 to-transparent" />
              </div>
              <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{profile?.name}</h2>
                  <p className="text-sm text-muted-foreground">Portfolio seller</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">{profile?._count?.items ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Koi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{profile?._count?.auctions ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Lelang</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border flex gap-4">
              {[
                { key: "koi", label: "Koi" },
                { key: "auctions", label: "Lelang" },
                { key: "stats", label: "Statistik" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 font-semibold border-b-2 transition ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            {activeTab === "koi" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      size: item.size,
                      variety: item.variety,
                      age: item.age ?? "-",
                      gender: item.gender,
                      status: item.status as any,
                      openBid: item.auctions?.[0]?.openBid,
                      image: item.media?.[0]?.url,
                    }}
                  />
                ))}
                {!items.length && (
                  <p className="text-sm text-muted-foreground">Belum ada koi.</p>
                )}
              </div>
            )}

            {activeTab === "auctions" && (
              <div className="space-y-4">
                {profile?.auctions?.map((auc) => (
                  <div key={auc.id} className="p-4 rounded-2xl border bg-card">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{auc.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(auc.startTime).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground capitalize">
                        {auc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!profile?.auctions?.length && (
                  <p className="text-sm text-muted-foreground">Belum ada lelang.</p>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Jumlah Lelang Dibuat", value: profile?.stats?.lelang_dibuat ?? profile?._count?.auctions },
                  { label: "Jumlah Lelang Diikuti", value: profile?.stats?.lelang_diikuti ?? profile?.stats?.auctionsJoined },
                  { label: "Jumlah Koi Terlelang", value: profile?.stats?.koi_terlelang },
                  { label: "Total Koi Dimenangkan", value: profile?.stats?.koi_dimenangkan },
                  { label: "Total Pendapatan", value: profile?.stats?.jumlah_pendapatan, isCurrency: true },
                  { label: "Total Pengeluaran", value: profile?.stats?.jumlah_pengeluaran, isCurrency: true },
                  { label: "Jumlah Koi", value: profile?.stats?.jumlah_koi ?? profile?._count?.items },
                  { label: "Jumlah Sertifikat", value: profile?.stats?.jumlah_sertifikat },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl border bg-muted/40">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold">
                      {stat.value === undefined || stat.value === null
                        ? "-"
                        : stat.isCurrency
                        ? formatCurrencyIDR(Number(stat.value))
                        : stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
