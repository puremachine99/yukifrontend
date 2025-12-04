"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, persistAuthSession } from "@/lib/api/auth";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Lengkapi semua field.");
      return;
    }

    setLoading(true);
    try {
      const session = await signup(form);
      persistAuthSession(session);
      toast.success("Akun berhasil dibuat.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-muted-foreground">Join YukiAuction today</p>
      </div>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Your name" value={form.name} onChange={handleChange("name")} />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="you@example.com" type="email" value={form.email} onChange={handleChange("email")} />
      </div>

      <div className="space-y-2">
        <Label>Phone</Label>
        <Input placeholder="08xxxx" type="tel" value={form.phone} onChange={handleChange("phone")} />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input placeholder="••••••••" type="password" value={form.password} onChange={handleChange("password")} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
