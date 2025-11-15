"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ItemGallery } from "@/components/item/item-gallery";
import { DeleteItemDialog } from "@/components/auction/delete-item-dialog";
import { Pencil, Trash2, Lock } from "lucide-react";

// Dummy data
const item = {
  id: 1,
  name: "Kohaku Jumbo",
  size: 72,
  variety: "Kohaku",
  gender: "Female",
  age: "Sansai (3y)",
  description:
    "A premium Kohaku with deep hi pattern, strong body shape and clean shiroji. Imported from Dainichi.",
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
};

const auctionHistory = [
  {
    id: 101,
    name: "New Year Festival Auction",
    status: "SOLD",
    soldPrice: 3800000,
    date: "Jan 02, 2025",
  },
  {
    id: 89,
    name: "December Winter Auction",
    status: "UNSOLD",
    soldPrice: null,
    date: "Dec 17, 2024",
  },
];

export default function ItemDetailPage() {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isLocked = auctionHistory.some((a) => a.status === "SOLD");

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-sm text-muted-foreground">Item ID: #{item.id}</p>

          {isLocked && (
            <Badge
              variant="destructive"
              className="mt-2 flex items-center gap-1"
            >
              <Lock className="size-3" />
              Sold Item – Locked
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {/* EDIT BUTTON */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                disabled={isLocked}
                onClick={() =>
                  router.push(`/dashboard/seller/items/${item.id}/edit`)
                }
              >
                <Pencil className="size-4" />
                Edit
              </Button>
            </TooltipTrigger>

            {isLocked && (
              <TooltipContent>
                This item has been sold and cannot be edited.
              </TooltipContent>
            )}
          </Tooltip>

          {/* DELETE BUTTON */}
          <Button
            variant="destructive"
            className="gap-2"
            disabled={isLocked}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT: GALLERY */}
        <div className="lg:col-span-1">
          <ItemGallery images={item.images} />
        </div>

        {/* RIGHT: DETAILS + HISTORY */}
        <div className="lg:col-span-2 space-y-8">
          {/* DETAILS */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Variety</div>
                <div className="font-medium">{item.variety}</div>

                <div className="text-muted-foreground">Size</div>
                <div className="font-medium">{item.size} cm</div>

                <div className="text-muted-foreground">Age</div>
                <div className="font-medium">{item.age}</div>

                <div className="text-muted-foreground">Gender</div>
                <div className="font-medium">{item.gender}</div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HISTORY */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Auction History</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {auctionHistory.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.date}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    {a.status === "SOLD" ? (
                      <p className="text-sm font-medium">
                        Sold at:{" "}
                        <span className="font-semibold text-green-600">
                          Rp {a.soldPrice?.toLocaleString()}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not Sold</p>
                    )}

                    <Badge
                      variant={a.status === "SOLD" ? "default" : "outline"}
                      className="uppercase text-xs"
                    >
                      {a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

      <DeleteItemDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          // UI only – habis delete balik ke list
          router.push("/dashboard/seller/items");
        }}
        itemName={item.name}
      />
    </div>
  );
}
