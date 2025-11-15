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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const orders = [
  {
    id: "ORD-2301",
    item: "Kohaku Supreme 65cm",
    buyer: "bidder#3021",
    status: "Awaiting Packing",
    paidAt: "Mar 10, 13:14",
    cartId: "CART-1012",
    price: 3700000,
    steps: [
      { label: "Payment", done: true },
      { label: "Packing", done: false },
      { label: "Courier pickup", done: false },
      { label: "In transit", done: false },
    ],
  },
  {
    id: "ORD-2294",
    item: "Showa Champion 58cm",
    buyer: "bidder#2877",
    status: "In Transit",
    paidAt: "Mar 08, 19:42",
    cartId: "CART-1008",
    price: 3100000,
    steps: [
      { label: "Payment", done: true },
      { label: "Packing", done: true },
      { label: "Courier pickup", done: true },
      { label: "In transit", done: true },
    ],
  },
];

const statusOptions = [
  "Awaiting Packing",
  "Packing",
  "Ready for Pickup",
  "In Transit",
  "Delivered",
];

export default function SellerOrdersPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Seller • Fulfillment
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Packed items pulled from bidder carts after payment clears.
          </p>
        </div>

        <Button variant="outline">Export Packing List</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle>{order.item}</CardTitle>
              <CardDescription>
                {order.id} • Cart {order.cartId} • Buyer {order.buyer}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Paid at {order.paidAt}
                </div>
                <Badge variant="secondary">{order.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Settlement</p>
                  <p className="font-semibold">Rp {order.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Latest Step</p>
                  <p className="font-semibold">
                    {order.steps.filter((s) => s.done).slice(-1)[0]?.label ??
                      "Awaiting"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select defaultValue={order.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proof / Notes</Label>
                <Textarea placeholder="Link video/picture packing, courier AWB, etc." />
              </div>

              <Button className="w-full">Save Progress (UI only)</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
