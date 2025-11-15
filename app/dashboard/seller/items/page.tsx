"use client";

import { useState, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ItemCard } from "@/components/item/item-card";
import { ItemRow } from "@/components/item/item-row";

import {
  Plus,
  Gauge,
  Scale,
  Layers,
  LayoutGrid,
  Rows3,
  Sparkles,
} from "lucide-react";

const items = [
  {
    id: 1,
    name: "Kohaku Jumbo",
    size: 72,
    variety: "Kohaku",
    gender: "Female",
    age: "Sansai (3y)",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Showa Supreme",
    size: 61,
    variety: "Showa",
    gender: "Male",
    age: "Nisai (2y)",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Tancho Beauty",
    size: 55,
    variety: "Tancho",
    gender: "Female",
    age: "Nisai (2y)",
    image: "/placeholder.svg",
  },
];

export default function SellerItemsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [search, setSearch] = useState("");
  const [variety, setVariety] = useState("all");
  const [sort, setSort] = useState("az");

  const totalItems = items.length;
  const avgSize = Math.round(
    items.reduce((sum, item) => sum + item.size, 0) / totalItems
  );
  const uniqueVarieties = new Set(items.map((item) => item.variety)).size;
  const highlightItem = items.reduce((largest, current) =>
    current.size > largest.size ? current : largest
  );

  const filteredItems = useMemo(() => {
    let list = [...items];

    // Search filter
    if (search.trim() !== "") {
      list = list.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Variety filter
    if (variety !== "all") {
      list = list.filter((i) => i.variety === variety);
    }

    // Sorting
    if (sort === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "size-asc") {
      list.sort((a, b) => a.size - b.size);
    } else if (sort === "size-desc") {
      list.sort((a, b) => b.size - a.size);
    }

    return list;
  }, [search, variety, sort]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Inventory
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">My Items</h1>
          <p className="text-sm text-muted-foreground">
            Keep your koi line-up polished before auctions go live
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/auctions">
              <Sparkles className="size-4" />
              Link to Auction
            </a>
          </Button>

          <Button className="gap-2" asChild>
            <a href="/dashboard/seller/items/create">
              <Plus className="size-4" />
              New Item
            </a>
          </Button>
        </div>
      </div>

      {/* SNAPSHOT */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-semibold">{totalItems}</p>
              <p className="text-xs text-muted-foreground">
                Ready to promote
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Scale className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Size</p>
              <p className="text-2xl font-semibold">{avgSize} cm</p>
              <p className="text-xs text-muted-foreground">
                Across your collection
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Variety Spread</p>
              <p className="text-2xl font-semibold">{uniqueVarieties}</p>
              <p className="text-xs text-muted-foreground">
                Unique bloodlines represented
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIGHLIGHT + FILTER */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              Spotlight Item
              <Badge variant="secondary" className="rounded-full">
                Largest
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{highlightItem.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Size</p>
                <p className="font-semibold">{highlightItem.size} cm</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Variety</p>
                <p className="font-semibold">{highlightItem.variety}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Gender</p>
                <p className="font-semibold">{highlightItem.gender}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Keep this koi on your primary promotion to attract bidders looking
              for oversized champions.
            </p>

            <div className="flex gap-2">
              <Button variant="default" className="flex-1">
                Edit Item
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={`/dashboard/seller/items/${highlightItem.id}`}>
                  View Detail
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FILTER BAR */}
        <Card className="rounded-2xl border lg:col-span-2">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Input
                placeholder="Search koi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="lg:w-1/3"
              />

              <Select value={variety} onValueChange={setVariety}>
                <SelectTrigger className="lg:w-40">
                  <SelectValue placeholder="Variety" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Kohaku">Kohaku</SelectItem>
                  <SelectItem value="Showa">Showa</SelectItem>
                  <SelectItem value="Sanke">Sanke</SelectItem>
                  <SelectItem value="Tancho">Tancho</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="lg:w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="az">A → Z</SelectItem>
                  <SelectItem value="za">Z → A</SelectItem>
                  <SelectItem value="size-asc">Size: small → big</SelectItem>
                  <SelectItem value="size-desc">Size: big → small</SelectItem>
                </SelectContent>
              </Select>

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
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {filteredItems.length} results
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {uniqueVarieties} varieties
              </Badge>
              <p>Tips: keep at least 8 items ready before launching a draft.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ITEMS LIST / GRID */}
      <div>
        {filteredItems.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} onEdit={() => {}} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <ItemRow key={item.id} item={item} onEdit={() => {}} />
              ))}
            </div>
          )
        ) : (
          <p className="text-muted-foreground text-sm">No items found.</p>
        )}
      </div>
    </div>
  );
}
