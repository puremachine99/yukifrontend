"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

type SellerRowItem = {
  id: number | string;
  name: string;
  size: number;
  variety: string;
  status?: string;
  image?: string;
};

export function ItemRow({
  item,
  onEdit,
}: {
  item: SellerRowItem;
  onEdit?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4 hover:border-primary/40 hover:bg-muted/30 transition md:flex-row md:items-center md:justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <div className="size-20 rounded-xl overflow-hidden border bg-muted">
          <img
            src={item.image ?? "/placeholder.svg"}
            className="object-cover w-full h-full"
            alt={item.name}
          />
        </div>

        <div className="space-y-1">
          <p className="font-semibold leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            Ukuran {item.size} cm • {item.variety}
          </p>
          {item.status && (
            <Badge
              variant="outline"
              className="rounded-full px-3 py-0.5 text-[11px]"
            >
              {item.status}
            </Badge>
          )}
        </div>
      </div>

      {/* EDIT BUTTON */}
      <Button
        variant="outline"
        size="sm"
        className="rounded-full w-full md:w-auto"
        onClick={onEdit}
      >
        <Settings className="size-4 mr-2" />
        Kelola
      </Button>
    </div>
  );
}
