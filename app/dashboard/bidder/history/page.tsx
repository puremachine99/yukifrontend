"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Clock8, Trophy, DollarSign } from "lucide-react";

const bidHistory = [
  {
    id: "BID-321",
    auction: "Kohaku Supreme Evening",
    bidAmount: 4200000,
    status: "Won",
    placedAt: "Mar 10, 20:45",
  },
  {
    id: "BID-318",
    auction: "Showa Rising Star",
    bidAmount: 2500000,
    status: "Outbid",
    placedAt: "Mar 09, 18:02",
  },
  {
    id: "BID-315",
    auction: "Tancho Prime Lot 07",
    bidAmount: 3100000,
    status: "Pending",
    placedAt: "Mar 08, 22:17",
  },
];

const transactionHistory = [
  {
    id: "TX-1091",
    item: "Doitsu Platinum",
    amount: 2350000,
    date: "Mar 08",
    status: "Paid",
  },
  {
    id: "TX-1087",
    item: "Asagi 35cm",
    amount: 1200000,
    date: "Feb 28",
    status: "Shipped",
  },
];

export default function BidderHistoryPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("bids");

  const filteredBids = useMemo(() => {
    if (!search.trim()) return bidHistory;
    return bidHistory.filter((item) =>
      item.auction.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • History
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bidding & Purchase Timeline
          </h1>
          <p className="text-sm text-muted-foreground">
            Review bids, wins, and payments in one place
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="gap-2">
            <Clock8 className="size-4" />
            Export Recent
          </Button>
          <Button className="gap-2">
            <DollarSign className="size-4" />
            Request Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active Bids
            </CardTitle>
            <CardDescription>Currently leading</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">03</CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Wins This Month
            </CardTitle>
            <CardDescription>Converted to payment</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">02</CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Paid Volume
            </CardTitle>
            <CardDescription>Completed transactions</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            Rp 3.55M
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-5">
          <Tabs value={tab} onValueChange={setTab} className="w-full lg:w-auto">
            <TabsList className="rounded-full">
              <TabsTrigger value="bids">Bid History</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            placeholder="Search auction or item…"
            className="lg:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Tabs value={tab}>
        <TabsContent value="bids" className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>
                Track each bid placement and outcome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Auction</TableHead>
                    <TableHead>Placed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          {bid.id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{bid.auction}</p>
                      </TableCell>
                      <TableCell>{bid.placedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bid.status === "Won"
                              ? "secondary"
                              : bid.status === "Pending"
                              ? "outline"
                              : "default"
                          }
                          className="rounded-full"
                        >
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        Rp {bid.bidAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Payments, shipping, and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactionHistory.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-col gap-2 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">{txn.id}</p>
                    <p className="font-semibold">{txn.item}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {txn.date}
                  </div>
                  <Badge
                    variant={
                      txn.status === "Paid"
                        ? "secondary"
                        : txn.status === "Shipped"
                        ? "outline"
                        : "default"
                    }
                    className="rounded-full"
                  >
                    {txn.status}
                  </Badge>
                  <div className="text-right font-semibold">
                    Rp {txn.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
