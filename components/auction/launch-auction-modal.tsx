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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock8, ShieldCheck } from "lucide-react";

export function LaunchAuctionModal({ onClose }: { onClose: () => void }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [timezone, setTimezone] = useState("GMT+7");

  const launch = () => {
    if (!start || !end) {
      toast.error("Isi jam mulai dan selesai");
      return;
    }

    toast.success("Auction scheduled & marked as READY (UI only)");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Launch Auction</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set the live window to lock this draft and notify bidders.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-full">
              Draft #0012
            </Badge>
            <span>Timezone</span>
            <Input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="h-7 w-28 text-xs"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date & Time</Label>
              <Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
              <Clock8 className="size-3.5 text-primary" />
              Recommended window: 3–4 hours for premium events.
            </div>
            <div className="rounded-xl border px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-primary" />
              Launch locks editing and notifies watchers instantly.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={launch}>Launch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
