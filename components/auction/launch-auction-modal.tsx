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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Clock8, ShieldCheck } from "lucide-react";

import { launchAuction } from "@/lib/api/auction";
import { useAuthSession } from "@/hooks/use-auth-session";

interface LaunchAuctionModalProps {
  auctionId: number | string;
  title: string;
  onClose: () => void;
  onLaunched?: () => void;
}

export function LaunchAuctionModal({ auctionId, title, onClose, onLaunched }: LaunchAuctionModalProps) {
  const { accessToken } = useAuthSession();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLaunch = async () => {
    if (!start || !end) {
      toast.error("Isi waktu mulai dan selesai.");
      return;
    }

    if (!accessToken) {
      toast.error("Tidak dapat launch tanpa sesi masuk.");
      return;
    }

    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();

    if (new Date(startISO) >= new Date(endISO)) {
      toast.error("End time harus lebih besar dari start time.");
      return;
    }

    if (confirmTitle.trim() !== title.trim()) {
      toast.error("Ketik judul yang sama persis untuk konfirmasi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await launchAuction(
        auctionId,
        {
          startTime: startISO,
          endTime: endISO,
        },
        accessToken
      );
      toast.success("Auction berhasil dijadwalkan.");
      onLaunched?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal melakukan launch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Launch Auction</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Jadwalkan jam mulai dan selesai, lalu konfirmasi judul untuk mengunci draft.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-full">
              {title}
            </Badge>
            <span>Auction akan berubah menjadi scheduled.</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>End Date & Time</Label>
              <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Confirm Title</Label>
            <Input
              placeholder="Ketik ulang judul lengkap"
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
            />
          </div>

          <Alert className="border-amber-300 bg-amber-50 text-amber-900">
            <AlertDescription className="flex items-center gap-2 text-sm">
              <Clock8 className="size-4" /> Auction will start automatically based on schedule.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
            <div className="rounded-xl border px-3 py-2 flex items-center gap-2">
              <Clock8 className="size-3.5 text-primary" />
              Gunakan durasi 2-4 jam untuk menjaga antusiasme.
            </div>
            <div className="rounded-xl border px-3 py-2 flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-primary" />
              Setelah launch, draft terkunci dan notifikasi dikirim.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleLaunch} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Launch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
