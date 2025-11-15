"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

type AuctionModalItem = {
  name: string;
  openBid: number;
  increment: number;
  buyNow?: number;
  size?: string | number;
  variety?: string;
};

export function EditItemModal({
  item,
  onClose,
}: {
  item: AuctionModalItem;
  onClose: () => void;
}) {
  const [openBid, setOpenBid] = useState(item.openBid);
  const [increment, setIncrement] = useState(item.increment);
  const [buyNow, setBuyNow] = useState(item.buyNow ?? 0);

  const saveChanges = () => {
    toast.success("Item pricing updated (UI only)");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Edit Item Settings</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Tweak bid parameters so they stay aligned with this koi’s quality.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{item.name}</span>
              <Badge variant="outline" className="rounded-full">
                Size {item.size ?? "--"}
              </Badge>
            </div>
            <p>Variety: {item.variety ?? "—"}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Open Bid</Label>
              <Input
                type="number"
                value={openBid}
                onChange={(e) => setOpenBid(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Bid Increment</Label>
              <Input
                type="number"
                value={increment}
                onChange={(e) => setIncrement(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Buy Now Price (optional)</Label>
            <Input
              type="number"
              value={buyNow}
              onChange={(e) => setBuyNow(Number(e.target.value))}
            />
          </div>

          <div className="rounded-xl border px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary" />
            Rule of thumb: increment should be at least 5% of open bid for
            premium koi.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveChanges}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
