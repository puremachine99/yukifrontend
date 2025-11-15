"use client";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing/navbar";

const marketItems = [
  {
    id: 1,
    title: "Kohaku Supreme 65cm",
    variety: "Kohaku",
    size: 65,
    auction: "Kohaku Spring Premier",
    price: 3700000,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Showa Champion 58cm",
    variety: "Showa",
    size: 58,
    auction: "Showa Rising Star",
    price: 3100000,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Tancho Premium 50cm",
    variety: "Tancho",
    size: 50,
    auction: "Tancho Spotlight Evening",
    price: 2550000,
    image: "/placeholder.svg",
  },
];

export default function MarketPage() {
  const [variety, setVariety] = useState("all");
  const [search, setSearch] = useState("");

  const filteredItems = marketItems.filter((item) => {
    const matchVariety = variety === "all" || item.variety === variety;
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.auction.toLowerCase().includes(search.toLowerCase());
    return matchVariety && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Marketplace
          </p>
          <h1 className="text-4xl font-semibold">Search koi across live auctions</h1>
          <p className="text-sm text-muted-foreground">
            Everything listed by sellers appears here. Add to wishlist or jump straight
            into the auction room.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 space-y-6">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-5">
            <Input
              placeholder="Search koi or auction…"
              className="lg:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={variety} onValueChange={setVariety}>
              <SelectTrigger className="lg:w-40">
                <SelectValue placeholder="Variety" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All varieties</SelectItem>
                <SelectItem value="Kohaku">Kohaku</SelectItem>
                <SelectItem value="Showa">Showa</SelectItem>
                <SelectItem value="Tancho">Tancho</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Advanced Filters</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="rounded-2xl border">
              <CardHeader className="pb-2">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.auction}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl overflow-hidden border bg-muted/40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-40"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{item.variety}</span>
                  <Badge variant="outline" className="rounded-full">
                    {item.size} cm
                  </Badge>
                </div>
                <p className="text-lg font-semibold">
                  Rp {item.price.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">View Auction</Button>
                  <Button variant="outline" className="flex-1">
                    Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredItems.length === 0 && (
            <Card className="col-span-3 rounded-2xl border-dashed border p-10 text-center text-sm text-muted-foreground">
              No items match your filters.
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
