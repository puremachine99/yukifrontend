"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck, MapPin, Trash2, Pencil, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/hooks/use-auth-session";
import { toast } from "sonner";

type UserAddress = {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const emptyAddress: Omit<UserAddress, "id" | "isDefault"> & { isDefault?: boolean } = {
  label: "",
  recipient: "",
  phone: "",
  addressLine: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Indonesia",
};

export default function BidderAddressesPage() {
  const { accessToken } = useAuthSession();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyAddress>(emptyAddress);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const baseUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, ""),
    []
  );

  const authHeaders = useMemo(() => {
    if (!accessToken) return {};
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }, [accessToken]);

  const fetchAddresses = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/user-address`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const list: UserAddress[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setAddresses(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat alamat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken]);

  const resetForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error("Masuk terlebih dahulu");
      return;
    }
    if (!form.label || !form.recipient || !form.phone || !form.addressLine || !form.city || !form.postalCode || !form.province) {
      toast.error("Lengkapi semua field wajib");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        isDefault: form.isDefault ?? false,
        country: form.country || "Indonesia",
      };

      const res = await fetch(
        editingId ? `${baseUrl}/user-address/${editingId}` : `${baseUrl}/user-address`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(editingId ? "Alamat diperbarui" : "Alamat ditambahkan");
      resetForm();
      fetchAddresses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan alamat");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus alamat ini?")) return;
    try {
      const res = await fetch(`${baseUrl}/user-address/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Alamat dihapus");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus alamat");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/user-address/${id}/default`, {
        method: "PATCH",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Default address diset");
      fetchAddresses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal set default");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bidder • Addresses</p>
          <h1 className="text-2xl font-semibold tracking-tight">Shipping & Pickup</h1>
          <p className="text-sm text-muted-foreground">Secure drop-off points for koi delivery or farm collection</p>
        </div>

        <Button className="gap-2" onClick={resetForm}>
          <PlusCircle className="size-4" />
          Add Address
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>Select preferred shipping destination per transaction</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="size-6" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No addresses saved yet.
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border p-4 space-y-2 hover:border-primary/40 transition"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{addr.label}</p>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="rounded-full">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!addr.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                          <CheckCircle2 className="size-4 mr-1" /> Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(addr.id);
                          setForm({
                            label: addr.label,
                            recipient: addr.recipient,
                            phone: addr.phone,
                            addressLine: addr.addressLine,
                            city: addr.city,
                            province: addr.province,
                            postalCode: addr.postalCode,
                            country: addr.country,
                            isDefault: addr.isDefault,
                          });
                        }}
                      >
                        <Pencil className="size-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(addr.id)}
                      >
                        <Trash2 className="size-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {addr.recipient} • {addr.phone}
                  </div>

                  <p className="text-sm">{addr.addressLine}</p>
                  <p className="text-xs text-muted-foreground">
                    {addr.city}, {addr.province} {addr.postalCode} • {addr.country}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>{editingId ? "Edit Address" : "Add New Address"}</CardTitle>
            <CardDescription>
              Buyer info sesuai payload API. Semua field wajib diisi, country default Indonesia.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Home, Office, Pickup"
              />
            </div>

            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input
                value={form.recipient}
                onChange={(e) => setForm((prev) => ({ ...prev, recipient: e.target.value }))}
                placeholder="Nama penerima"
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="08xx"
              />
            </div>

            <div className="space-y-2">
              <Label>Alamat Lengkap</Label>
              <Textarea
                value={form.addressLine}
                onChange={(e) => setForm((prev) => ({ ...prev, addressLine: e.target.value }))}
                placeholder="Jalan, RT/RW, komplek"
                className="h-24"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Kota</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Kota / Kabupaten"
                />
              </div>
              <div className="space-y-2">
                <Label>Provinsi</Label>
                <Input
                  value={form.province}
                  onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
                  placeholder="Provinsi"
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Pos</Label>
                <Input
                  value={form.postalCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="Kode Pos"
                />
              </div>
              <div className="space-y-2">
                <Label>Negara</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  placeholder="Indonesia"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isDefault"
                type="checkbox"
                checked={form.isDefault ?? false}
                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              />
              <Label htmlFor="isDefault">Set as default</Label>
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={saving}>
              {saving ? "Menyimpan..." : editingId ? "Update Address" : "Save Address"}
            </Button>

            <div className="rounded-2xl border bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Verified addresses speed up shipping & pickup scheduling.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
