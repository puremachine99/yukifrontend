"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OTPForm() {
  const [otp, setOtp] = useState("");

  return (
    <form className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Verify your OTP</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* OTP INPUT */}
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Input
            key={i}
            maxLength={1}
            className="w-10 h-12 text-center text-xl"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/, "");
              setOtp((prev) => {
                const chars = prev.split("");
                chars[i] = value;
                return chars.join("");
              });
            }}
          />
        ))}
      </div>

      {/* BUTTON */}
      <Button className="w-full" asChild>
        <Link href="/dashboard">Verify</Link>
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Didn’t receive the code?{" "}
        <button type="button" className="underline">
          Resend
        </button>
      </p>
    </form>
  );
}
