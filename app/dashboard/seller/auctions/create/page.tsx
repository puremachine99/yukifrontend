"use client";

import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Sparkles, ArrowLeft, CalendarRange } from "lucide-react";
import { toast } from "sonner";

export default function CreateAuctionPage() {
  const router = useRouter();

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setBannerPreview(url);
  };

  const handleSaveDraft = () => {
    toast.success("Draft lelang berhasil dibuat");
    router.push("/dashboard/seller/auctions/1"); // dummy id
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Seller • Auction Draft
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Auction
          </h1>
          <p className="text-sm text-muted-foreground">
            Package your koi lineup into a compelling live event
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/dashboard/seller/auctions">
              <ArrowLeft className="size-4" />
              Back to list
            </a>
          </Button>

          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/items">
              <Sparkles className="size-4" />
              Pick Items
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Auction Information</CardTitle>
            <CardDescription>
              Fill the essentials — this stays in <strong>Draft</strong> until
              launch
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Evening Premium Auction" />
              </div>

              <div className="space-y-2">
                <Label>Schedule (optional)</Label>
                <div className="flex gap-2">
                  <Input type="date" />
                  <Input type="time" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Short description about this auction..."
                className="h-28"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input placeholder="GMT+7 (Jakarta)" />
              </div>

              <div className="space-y-2">
                <Label>Expected lots</Label>
                <Input type="number" placeholder="e.g. 12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Banner</Label>

              <div className="flex flex-col gap-3">
                {bannerPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border">
                    <img
                      src={bannerPreview}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 border rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
                    <Image className="size-10 mb-2" />
                    <p className="text-sm font-medium">No banner uploaded</p>
                    <p className="text-xs">Recommended 1600×600, JPG/PNG</p>
                  </div>
                )}

                <Button variant="outline" className="w-fit gap-2">
                  <Upload className="size-4" />
                  <Label className="cursor-pointer">
                    <span>Upload Banner</span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                  </Label>
                </Button>
              </div>
            </div>

            <Button className="w-full" onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Launch Steps</CardTitle>
            <CardDescription>
              Quick reminders before you go live
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl border p-4 space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <CalendarRange className="size-4 text-primary" />
                Timeline ready
              </p>
              <p className="text-muted-foreground">
                Lock in start/end times so bidders can set reminders.
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <p className="font-semibold">Items selected</p>
              <p className="text-muted-foreground">
                Add koi pieces with rich media and pricing details.
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <p className="font-semibold">Preview launch</p>
              <p className="text-muted-foreground">
                Use Launch button on draft page to simulate final state.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
