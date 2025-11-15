"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Camera, Video } from "lucide-react";

const shipmentTimeline = [
  {
    id: "SHIP-8001",
    item: "Kohaku Supreme 65cm",
    seller: "Shinoda Koi Farm",
    status: "In Transit",
    steps: [
      { label: "Seller Inspection", detail: "Video proof uploaded", done: true },
      { label: "Packing", detail: "Water parameters noted", done: true },
      { label: "Courier Pickup", detail: "Gosend - insulated box", done: true },
      { label: "On Route", detail: "ETA 1 day", done: false },
      { label: "Delivered", detail: "Awaiting confirmation", done: false },
    ],
  },
  {
    id: "SHIP-7990",
    item: "Showa Champion 58cm",
    seller: "Izumiya",
    status: "Delivered",
    steps: [
      { label: "Seller Inspection", detail: "Photos attached", done: true },
      { label: "Packing", detail: "Double plastic + O2", done: true },
      { label: "Courier Pickup", detail: "JNE Cargo", done: true },
      { label: "On Route", detail: "Arrived", done: true },
      { label: "Delivered", detail: "Bidder confirmation pending", done: true },
    ],
  },
];

export default function BidderShipmentsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Shipments
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Delivery & Condition Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Seller documents each step before the koi arrives at your pond.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {shipmentTimeline.map((shipment) => (
          <Card key={shipment.id} className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle>{shipment.item}</CardTitle>
              <CardDescription>
                {shipment.id} • Seller: {shipment.seller}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="rounded-full px-4 py-1">
                  {shipment.status}
                </Badge>
                <Button variant="outline" size="sm" className="gap-2">
                  <Package className="size-4" />
                  Track Courier
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {shipment.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className={`size-4 mt-1 ${
                        step.done ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-foreground">{step.label}</p>
                      <p>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex gap-2">
                <Camera className="size-4 text-primary" />
                Seller uploads video/photo proof at each step to protect both parties.
              </div>

              {shipment.status === "Delivered" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Confirm Arrival & Review</p>
                  <Textarea placeholder="Share unboxing notes (UI only)" className="h-24" />
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Video className="size-4" />
                      Upload Unboxing
                    </Button>
                    <Button>Submit Review</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
