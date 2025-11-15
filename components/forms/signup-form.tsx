"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-muted-foreground">Join YukiAuction today</p>
      </div>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Your name" />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="you@example.com" type="email" />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input placeholder="••••••••" type="password" />
      </div>

      <Button type="submit" className="w-full" asChild>
        <Link href="/dashboard">Create Account</Link>
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
