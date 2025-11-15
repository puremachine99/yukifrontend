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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Layers, Sparkles, ArrowLeft } from "lucide-react";

const dummyItems = [
  {
    id: 1,
    name: "Kohaku Jumbo",
    size: "70cm",
    grade: "A",
  },
  {
    id: 2,
    name: "Showa Supreme",
    size: "62cm",
    grade: "A+",
  },
  {
    id: 3,
    name: "Sanke High Quality",
    size: "55cm",
    grade: "B+",
  },
  {
    id: 4,
    name: "Shiro Utsuri Classic",
    size: "58cm",
    grade: "A",
  },
];

export default function AuctionItemsSelectPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addSelectedItems = () => {
    if (selected.length === 0) {
      toast.error("Pilih setidaknya 1 item");
      return;
    }

    toast.success(`Berhasil memasukkan ${selected.length} item ke lelang`);
    router.push("/dashboard/seller/auctions/1"); // dummy redirect
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Auction Builder
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Select Items</h1>
          <p className="text-sm text-muted-foreground">
            Choose which koi pieces enter this auction
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="gap-2" asChild>
            <a href={`/dashboard/seller/auctions/1`}>
              <ArrowLeft className="size-4" />
              Back to draft
            </a>
          </Button>

          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/items/create">
              <Sparkles className="size-4" />
              Create new item
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Items</CardTitle>
            <CardDescription>Tick to include in this auction</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {dummyItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-2xl p-4 hover:bg-muted/40 transition"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={() => toggle(item.id)}
                  />

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size {item.size} • Grade {item.grade}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="rounded-full px-3 py-1">
                  #{String(item.id).padStart(3, "0")}
                </Badge>
              </div>
            ))}

            {dummyItems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You don't have any items yet.
              </p>
            )}

            <Button className="w-full mt-4" onClick={addSelectedItems}>
              Add Selected Items
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Selection Summary</CardTitle>
            <CardDescription>Overview before saving</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Items chosen</p>
              <p className="text-2xl font-semibold">{selected.length}</p>
              <p className="text-xs text-muted-foreground">
                Maximum recommended per auction: 10
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Variety mix</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                {new Set(
                  dummyItems
                    .filter((item) => selected.includes(item.id))
                    .map((item) => item.name.split(" ")[0])
                ).size || 0}{" "}
                types
              </p>
              <p className="text-xs text-muted-foreground">
                Add multiple bloodlines to attract broader bidders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
