"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Megaphone, Sparkles, Gauge, LineChart, ExternalLink } from "lucide-react";

const dummyAds = [
  {
    id: "AD-2387",
    title: "Premium Kohaku Weekend",
    placement: "Homepage Banner",
    period: "Mar 12 - Mar 19",
    status: "Published",
    impressions: 18200,
    clicks: 1240,
  },
  {
    id: "AD-2388",
    title: "Live Auction: Sanke Special",
    placement: "Dashboard Spotlight",
    period: "Mar 20 - Mar 24",
    status: "Pending",
    impressions: 0,
    clicks: 0,
  },
  {
    id: "AD-2389",
    title: "Flash Sale — Tancho Trio",
    placement: "Bidder Feed",
    period: "Mar 01 - Mar 07",
    status: "Expired",
    impressions: 9100,
    clicks: 460,
  },
];

const statusToVariant: Record<string, "default" | "secondary" | "outline"> = {
  Published: "default",
  Pending: "secondary",
  Expired: "outline",
};

export default function SellerAdsPage() {
  const [placement, setPlacement] = useState("homepage");
  const [objective, setObjective] = useState("traffic");

  const totalImpressions = dummyAds.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = dummyAds.reduce((sum, ad) => sum + ad.clicks, 0);
  const ctr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  const handleSubmit = () => {
    toast.success("Ad request sent to Yuki Admin (UI only)");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Advertisements</h1>
          <p className="text-sm text-muted-foreground">
            Promote your auctions across YukiAuction surfaces
          </p>
        </div>

        <Button className="gap-2" onClick={handleSubmit}>
          <Megaphone className="size-4" />
          Quick Promote
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Live Campaigns</p>
              <p className="text-2xl font-semibold">
                {dummyAds.filter((ad) => ad.status === "Published").length}
              </p>
              <p className="text-xs text-muted-foreground">Published & running now</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Impressions</p>
              <p className="text-2xl font-semibold">{totalImpressions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Across all placements</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <LineChart className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average CTR</p>
              <p className="text-2xl font-semibold">{ctr}%</p>
              <p className="text-xs text-muted-foreground">Click-through performance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ADS LIST */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Ad Requests</CardTitle>
            <CardDescription>Track every submission & publishing status</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dummyAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <p className="font-medium">{ad.title}</p>
                        <p className="text-xs text-muted-foreground">{ad.id}</p>
                      </TableCell>
                      <TableCell className="text-sm">{ad.placement}</TableCell>
                      <TableCell className="text-sm">{ad.period}</TableCell>
                      <TableCell>
                        <Badge variant={statusToVariant[ad.status] ?? "outline"} className="rounded-full">
                          {ad.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        <div className="font-semibold">
                          {ad.impressions.toLocaleString()} imp
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {ad.clicks.toLocaleString()} clicks
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Need more insights?</p>
                <p className="text-xs text-muted-foreground">
                  Detailed analytics will be available in the upcoming admin dashboard.
                </p>
              </div>

              <Button variant="ghost" className="gap-2">
                View mock report
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FORM */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Submit Ad Request</CardTitle>
            <CardDescription>Fill the application — reviewed by Yuki Admin</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Campaign Title</Label>
              <Input placeholder="Premium Auction Spotlight" />
            </div>

            <div className="space-y-2">
              <Label>Promoted Auction / Item</Label>
              <Input placeholder="Auction ID or URL" />
            </div>

            <div className="space-y-2">
              <Label>Placement</Label>
              <Select value={placement} onValueChange={setPlacement}>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Homepage Banner</SelectItem>
                  <SelectItem value="dashboard">Dashboard Spotlight</SelectItem>
                  <SelectItem value="bidder-feed">Bidder Feed Card</SelectItem>
                  <SelectItem value="notification">Notification Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objective</Label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic">Traffic to auction</SelectItem>
                  <SelectItem value="bids">Increase bids</SelectItem>
                  <SelectItem value="brand">Brand awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Budget (IDR)</Label>
              <Input type="number" placeholder="e.g. 2.500.000" />
            </div>

            <div className="space-y-2">
              <Label>Notes to Admin</Label>
              <Textarea placeholder="Tell us about the creative, CTA, special instruction..." className="h-24" />
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              Submit Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
