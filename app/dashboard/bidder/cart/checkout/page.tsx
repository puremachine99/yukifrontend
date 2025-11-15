"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";

const addresses = [
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

const dummyCartSelection = {
  items: [
    { id: "CART-1012", title: "Kohaku Supreme 65cm", price: 3700000 },
    { id: "CART-1010", title: "Showa Champion 58cm", price: 3100000 },
  ],
};

export default function CheckoutFormPage() {
  const [address, setAddress] = useState("addr-1");
  const [customAddress, setCustomAddress] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"ship" | "hold">("ship");
  const [holdDuration, setHoldDuration] = useState("7-days");
  const [shippingCost, setShippingCost] = useState<number | undefined>();

  const subtotal = dummyCartSelection.items.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const adminFee = subtotal * 0.05;
  const tax = subtotal * 0.11;
  const shipping = shippingCost ?? 0;
  const total = subtotal + adminFee + tax + shipping;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Checkout
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Confirm Payment Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Once submitted, invoice and proof will be issued automatically (UI
            only).
          </p>
        </div>

        <Button variant="ghost" asChild>
          <Link href="/dashboard/bidder/cart">← Back to Cart</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Recipient & Shipping</CardTitle>
            <CardDescription>
              Fill the form before redirecting to Xendit checkout (UI only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Nama lengkap sesuai KTP" />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+62 8xx xxxx xxxx" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Select value={address} onValueChange={setAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih alamat" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Alamat baru...</SelectItem>
                </SelectContent>
              </Select>
              {address === "other" && (
                <Textarea
                  placeholder="Tulis alamat lengkap"
                  className="mt-2"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Delivery Mode</Label>
                <Select
                  value={deliveryMode}
                  onValueChange={(val) =>
                    setDeliveryMode(val as "ship" | "hold")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ship">Ship Immediately</SelectItem>
                    <SelectItem value="hold">
                      Titip dulu / Hold shipment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deliveryMode === "hold" && (
                <div className="space-y-2">
                  <Label>Hold Duration</Label>
                  <Select value={holdDuration} onValueChange={setHoldDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-days">7 days</SelectItem>
                      <SelectItem value="14-days">14 days</SelectItem>
                      <SelectItem value="30-days">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Shipping Cost (manual)</Label>
              <Input
                type="number"
                placeholder="Rp"
                value={shippingCost ?? ""}
                onChange={(e) =>
                  setShippingCost(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Summary</CardTitle>
            <CardDescription>All amounts shown in IDR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              {dummyCartSelection.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>Rp {item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Fee (5%)</span>
                <span>Rp {adminFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (11%)</span>
                <span>Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>
                  {shippingCost ? `Rp ${shipping.toLocaleString()}` : "—"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
            <Button className="w-full">Pay via Xendit (mock)</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
