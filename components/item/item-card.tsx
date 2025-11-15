"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Droplet } from "lucide-react";

type SellerItem = {
  id: number | string;
  name: string;
  size: number;
  variety: string;
  age: string;
  gender?: string;
  status?: "for-sale" | "sold" | "draft";
  openBid?: number;
  image?: string;
};

const statusLabel: Record<
  NonNullable<SellerItem["status"]>,
  { label: string; variant: "outline" | "default" | "secondary" }
> = {
  "for-sale": { label: "For Sale", variant: "outline" },
  sold: { label: "Sold", variant: "default" },
  draft: { label: "Draft", variant: "secondary" },
};

export function ItemCard({
  item,
  onEdit,
}: {
  item: SellerItem;
  onEdit?: () => void;
}) {
  return (
    <Card className="rounded-2xl overflow-hidden border hover:shadow-lg transition">
      {/* HEADER */}
      <CardHeader className="p-4 pb-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold truncate">
              {item.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Variety • {item.variety}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onEdit}
          >
            <Settings className="size-4" />
          </Button>
        </div>

        {item.status && (
          <Badge
            variant={statusLabel[item.status]?.variant ?? "outline"}
            className="rounded-full px-3 py-0.5 text-[11px] w-fit"
          >
            {statusLabel[item.status]?.label ?? item.status}
          </Badge>
        )}
      </CardHeader>

      {/* IMAGE */}
      <CardContent className="p-4 pb-0">
        <AspectRatio
          ratio={1 / 1}
          className="rounded-xl overflow-hidden border bg-muted/40"
        >
          <img
            src={item.image ?? "/placeholder.svg"}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardContent>

      {/* INFO */}
      <CardContent className="p-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground text-xs">Size</p>
            <p className="font-semibold">{item.size} cm</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Age</p>
            <p className="font-semibold">{item.age}</p>
          </div>
          {item.gender && (
            <div>
              <p className="text-muted-foreground text-xs">Gender</p>
              <p className="font-semibold">{item.gender}</p>
            </div>
          )}
          {item.openBid && (
            <div>
              <p className="text-muted-foreground text-xs">Open Bid</p>
              <p className="font-semibold">
                Rp {item.openBid.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <Droplet className="size-3.5 text-primary" />
          Keep photo & measurement updated weekly for trusted buyers.
        </div>
      </CardContent>
    </Card>
  );
}
