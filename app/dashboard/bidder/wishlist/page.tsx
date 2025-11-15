"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutGrid, Rows3, HeartCrack, Sparkles } from "lucide-react";

const dummyWishlist = [
  {
    id: 1421,
    title: "Kohaku Supreme 65cm",
    variety: "Kohaku",
    size: 65,
    seller: "Shinoda Koi Farm",
    price: 3200000,
    status: "Live",
  },
  {
    id: 1398,
    title: "Showa Champion 58cm",
    variety: "Showa",
    size: 58,
    seller: "Izumiya",
    price: 2800000,
    status: "Upcoming",
  },
  {
    id: 1390,
    title: "Tancho Premium 50cm",
    variety: "Tancho",
    size: 50,
    seller: "Dainichi",
    price: 2100000,
    status: "Sold",
  },
];

export default function BidderWishlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filteredWishlist = useMemo(() => {
    if (!search.trim()) return dummyWishlist;
    return dummyWishlist.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Wishlist
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Saved Auctions & Koi
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep an eye on pieces you plan to bid on soon
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="gap-2" disabled>
            <HeartCrack className="size-4" />
            Remove Selected
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/bidder/wishlist/monitor">
              <LayoutGrid className="size-4" />
              Monitoring Board
            </a>
          </Button>
          <Button className="gap-2" disabled={!selected.length}>
            <Sparkles className="size-4" />
            Move to Active Bids
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Saved
            </CardTitle>
            <CardDescription>Across live & upcoming</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {dummyWishlist.length}
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Live Auctions
            </CardTitle>
            <CardDescription>Ready to bid right now</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {dummyWishlist.filter((item) => item.status === "Live").length}
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Upcoming Launches
            </CardTitle>
            <CardDescription>Plan reminders early</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {dummyWishlist.filter((item) => item.status === "Upcoming").length}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-5">
          <Input
            placeholder="Search saved koi…"
            className="lg:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 rounded-full border px-2 py-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="size-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => setViewMode("list")}
            >
              <Rows3 className="size-4" />
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Wishlist</CardTitle>
          <CardDescription>
            Select and manage your tracked koi and auctions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {filteredWishlist.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <p className="text-sm font-semibold">No koi saved yet</p>
              <p className="text-sm text-muted-foreground">
                Browse auctions and tap the heart icon to build your wishlist.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredWishlist.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-4 space-y-3 hover:border-primary/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full">
                      #{item.id}
                    </Badge>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => toggle(item.id)}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variety} • {item.size} cm
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Seller • {item.seller}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      Rp {item.price.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        item.status === "Live"
                          ? "secondary"
                          : item.status === "Upcoming"
                          ? "outline"
                          : "default"
                      }
                      className="rounded-full"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Auction
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>Item</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredWishlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() => toggle(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{item.title}</div>
                      <p className="text-xs text-muted-foreground">
                        {item.variety} • {item.size} cm
                      </p>
                    </TableCell>
                    <TableCell>{item.seller}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Live"
                            ? "secondary"
                            : item.status === "Upcoming"
                            ? "outline"
                            : "default"
                        }
                        className="rounded-full"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      Rp {item.price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
