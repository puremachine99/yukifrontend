"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, persistAuthSession } from "@/lib/api/auth";

const formInitial = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState(formInitial);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = await login({
        email: form.email.trim(),
        password: form.password,
      });

      persistAuthSession(payload);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to log in right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Login to your YukiAuction account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="text-center text-sm font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Logging in…" : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
