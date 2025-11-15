"use client";

import { useState } from "react";
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
import { PlusCircle, MapPin, ShieldCheck } from "lucide-react";

const dummyAddresses = [
  {
    id: 1,
    label: "Primary Residence",
    recipient: "John Auctioneer",
    phone: "+62 812-2345-6789",
    address: "Jalan Kemang Raya No. 12, Jakarta Selatan",
    city: "Jakarta",
    postal: "12730",
    isDefault: true,
  },
  {
    id: 2,
    label: "Farm Pickup",
    recipient: "John Auctioneer",
    phone: "+62 812-2345-6789",
    address: "Jl. Raya Lembang KM 5, Bandung",
    city: "Bandung",
    postal: "40135",
    isDefault: false,
  },
];

export default function BidderAddressesPage() {
  const [addresses] = useState(dummyAddresses);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Addresses
          </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Shipping & Pickup
            </h1>
            <p className="text-sm text-muted-foreground">
              Secure drop-off points for koi delivery or farm collection
            </p>
        </div>

        <Button className="gap-2">
          <PlusCircle className="size-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>
              Select preferred shipping destination per transaction
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-2xl border p-4 space-y-2 hover:border-primary/40 transition"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold">{addr.label}</p>
                  {addr.isDefault && (
                    <Badge variant="secondary" className="rounded-full">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {addr.recipient} • {addr.phone}
                </div>

                <p className="text-sm">{addr.address}</p>
                <p className="text-xs text-muted-foreground">
                  {addr.city}, {addr.postal}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Set Default
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No addresses saved yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Add New Address</CardTitle>
            <CardDescription>
              Buyer info (UI-only form; not wired yet)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input placeholder="e.g. Home, Office, Warehouse" />
            </div>

            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+62 8xx xxxx xxxx" />
            </div>

            <div className="space-y-2">
              <Label>Full Address</Label>
              <Textarea placeholder="Street, neighborhood, complex" className="h-28" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City / Regency" />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input placeholder="XXXX" />
              </div>
            </div>

            <Button className="w-full">Save Address</Button>

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
