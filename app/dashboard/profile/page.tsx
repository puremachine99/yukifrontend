"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, UserCheck, Sparkles, Upload } from "lucide-react";
import { useAuthSession } from "@/hooks/use-auth-session";
import { default as Link } from "next/link";
import { UsersService } from "@/lib/api-client/services/UsersService";
import { configureApiClient } from "@/lib/api-client/configure";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, displayName, initials, isAuthenticated, accessToken } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    city: "",
    instagram: "",
    youtube: "",
    avatar: "",
    banner: "",
  });

  const heroUser = useMemo(() => profile ?? user, [profile, user]);

  const heroName = displayName ?? heroUser?.name ?? "User";
  const heroEmail = heroUser?.email ?? "-";
  const heroLocation = heroUser?.location ?? heroUser?.city ?? "-";
  const joinDateRaw = heroUser?.createdAt ?? heroUser?.joinedAt ?? heroUser?.memberSince;
  const parsedJoinDate =
    typeof joinDateRaw === "string" ? Date.parse(joinDateRaw) : NaN;
  const heroJoinDate =
    joinDateRaw && !Number.isNaN(parsedJoinDate)
      ? new Date(parsedJoinDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

  const heroStatus = isAuthenticated ? "Logged in" : "Guest view";
  const heroStatusDetail = isAuthenticated
    ? "Session aktif, akses dashboard penuh."
    : "Butuh login untuk melihat data real-time.";

  const heroInitials =
    initials ??
    heroName
      .split(" ")
      .map((segment) => segment[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase();

  useEffect(() => {
    if (!accessToken) return;
    configureApiClient(accessToken);
    setLoading(true);
    UsersService.usersControllerGetOwnProfile()
      .then((res) => {
        setProfile(res);
        setForm((prev) => ({
          ...prev,
          name: res?.name ?? "",
          bio: res?.bio ?? "",
          city: res?.city ?? "",
          instagram: res?.instagram ?? "",
          youtube: res?.youtube ?? "",
          avatar: res?.avatar ?? "",
          banner: res?.banner ?? "",
        }));
      })
      .catch(() => {
        toast.error("Tidak dapat memuat profil.");
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBannerUpload = async (file: File) => {
    setUploadingBanner(true);
    const data = new FormData();
    data.append("banner", file);
    try {
      const res = await fetch("/api/upload/banner", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Upload gagal");
      setForm((prev) => ({ ...prev, banner: json.url }));
      toast.success("Banner berhasil diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) {
      toast.error("Masuk untuk menyimpan perubahan.");
      return;
    }
    setSaving(true);
    configureApiClient(accessToken);
    try {
      await UsersService.usersControllerUpdateOwnProfile(form);
      toast.success("Profil diperbarui.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* PROFILE HERO */}
      <Card className="rounded-3xl border bg-card">
        <div className="px-6 py-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border border-border rounded-2xl">
              <AvatarImage
                src={typeof heroUser?.avatar === "string" ? heroUser.avatar : undefined}
                alt={heroName}
              />
              <AvatarFallback className="text-2xl font-semibold uppercase">
                {heroInitials || "YK"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Seller Profile
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                {heroName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{heroEmail}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {heroLocation}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Joined {heroJoinDate}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="uppercase tracking-[0.3em] text-[10px]">
                  {heroStatus}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {heroStatusDetail}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="gap-2"
              asChild
              disabled={!heroUser?.id}
            >
              <Link href={heroUser?.id ? `/u/${heroUser.id}` : "#"}>
                <UserCheck className="size-4" />
                View Public Profile
              </Link>
            </Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving || loading}>
              <Sparkles className="size-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 px-6 py-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              User ID
            </p>
            <div className="mt-2 text-2xl font-semibold">{user?.id ?? "-"}</div>
            <p className="text-xs text-muted-foreground">
              Identitas internal pengguna
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Role
            </p>
            <p className="mt-2 text-2xl font-semibold">{user?.role ?? "-"}</p>
            <p className="text-xs text-muted-foreground">Hak akses saat ini</p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Joined
            </p>
            <p className="mt-2 text-2xl font-semibold">{heroJoinDate}</p>
            <p className="text-xs text-muted-foreground">
              Tanggal pembuatan akun
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>Data Profil</CardTitle>
              <CardDescription>
                Semua informasi diambil dari akun aktif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-semibold text-foreground">
                  {heroName}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold text-foreground">
                  {heroEmail}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-muted-foreground">Lokasi</span>
                <span className="font-semibold text-foreground">
                  {heroLocation}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-muted-foreground">Bergabung</span>
                <span className="font-semibold text-foreground">
                  {heroJoinDate}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Perbarui informasi profil dan banner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={heroEmail} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Kota</Label>
                  <Input
                    value={form.city}
                    onChange={handleChange("city")}
                    placeholder="Lokasi"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={form.instagram}
                    onChange={handleChange("instagram")}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Youtube</Label>
                  <Input
                    value={form.youtube}
                    onChange={handleChange("youtube")}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={form.bio}
                  onChange={handleChange("bio")}
                  placeholder="Ceritakan tentang diri atau farm"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Avatar (URL)</Label>
                  <Input
                    value={form.avatar}
                    onChange={handleChange("avatar")}
                    placeholder="https://..."
                  />
                  <div className="border rounded-xl p-3 bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-2">Pratinjau</p>
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={form.avatar} alt="avatar preview" />
                      <AvatarFallback>{heroInitials || "YK"}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Banner</Label>
                  <div className="flex gap-2">
                    <Input
                      value={form.banner}
                      onChange={handleChange("banner")}
                      placeholder="https://..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => document.getElementById("bannerFile")?.click()}
                      disabled={uploadingBanner}
                    >
                      <Upload className="size-4" />
                      {uploadingBanner ? "Uploading..." : "Upload"}
                    </Button>
                    <input
                      id="bannerFile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file);
                      }}
                    />
                  </div>
                  {form.banner && (
                    <div className="rounded-xl overflow-hidden border">
                      <img src={form.banner} alt="Banner preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      name: profile?.name ?? "",
                      bio: profile?.bio ?? "",
                      city: profile?.city ?? "",
                      instagram: profile?.instagram ?? "",
                      youtube: profile?.youtube ?? "",
                      avatar: profile?.avatar ?? "",
                      banner: profile?.banner ?? "",
                    }))
                  }
                >
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={saving || loading}>
                  {saving ? "Saving..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
