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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const balanceSummary = {
  available: 12500000,
  pending: 3200000,
  lastPayout: "Mar 05, 2025",
  lifetime: 86000000,
};

const transactions = [
  {
    id: "TX-8901",
    type: "Sale",
    item: "Kohaku Supreme 65cm",
    amount: 3700000,
    status: "Settled",
    date: "Mar 10",
  },
  {
    id: "TX-8887",
    type: "Sale",
    item: "Showa Champion 58cm",
    amount: 3100000,
    status: "Pending",
    date: "Mar 09",
  },
  {
    id: "TX-8820",
    type: "Payout",
    item: "Bank Transfer",
    amount: -5000000,
    status: "Completed",
    date: "Mar 05",
  },
];

const payoutRequests = [
  {
    id: "WD-1201",
    amount: 4000000,
    status: "In Review",
    requestedAt: "Mar 11, 15:20",
    note: "Transfer to BCA ****090",
  },
];

export default function SellerBalancePage() {
  const [payoutOpen, setPayoutOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Seller • Finance
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Balance & Payouts
          </h1>
          <p className="text-sm text-muted-foreground">
            Track settlements, pending earnings, and withdrawal history.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            Export Finance Report
          </Button>
          <Button className="gap-2" onClick={() => setPayoutOpen(true)}>
            Request Payout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Ready to withdraw</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            Rp {balanceSummary.available.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Pending Settlement</CardTitle>
            <CardDescription>Funds clearing in escrow</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            Rp {balanceSummary.pending.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Last Payout</CardTitle>
            <CardDescription>BCA ****090</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {balanceSummary.lastPayout}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>Lifetime Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            Rp {balanceSummary.lifetime.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Sales, fees, payouts</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="rounded-2xl border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground">{txn.id}</p>
                  <p className="font-semibold">{txn.item}</p>
                </div>
                <div className="text-sm text-muted-foreground">{txn.date}</div>
                <Badge
                  variant={txn.status === "Pending" ? "outline" : "secondary"}
                >
                  {txn.status}
                </Badge>
                <div
                  className={`font-semibold ${
                    txn.amount < 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {txn.amount < 0 ? "-" : ""}Rp{" "}
                  {Math.abs(txn.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Current Payout Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payoutRequests.map((req) => (
                <div key={req.id} className="rounded-2xl border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{req.id}</p>
                    <Badge variant="outline">{req.status}</Badge>
                  </div>
                  <p className="text-lg font-semibold">
                    Rp {req.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {req.requestedAt}
                  </p>
                  <p className="text-sm text-muted-foreground">{req.note}</p>
                </div>
              ))}

              {payoutRequests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No pending requests.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-muted/40">
            <CardHeader>
              <CardTitle>Settlement Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p>Escrow to balance</p>
                <Progress value={64} className="mt-1" />
              </div>
              <div>
                <p>Payout processing</p>
                <Progress value={30} className="mt-1" />
              </div>
              <Separator />
              <p>
                Funding service fee is auto-deducted (5%). Withdrawals above Rp
                20M require manual KYC.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Submit withdrawal details. Manual review for amounts above Rp
              20.000.000.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Destination Account</Label>
              <Input placeholder="BCA ****090 (auto-fill later)" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="Rp" />
              </div>
              <div className="space-y-2">
                <Label>2FA / PIN</Label>
                <Input type="password" placeholder="******" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Optional note to finance team (UI-only)" />
            </div>

            <div className="rounded-2xl border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              Payouts take 1–2 business days. You’ll receive a confirmation
              email once processed.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutOpen(false)}>
              Cancel
            </Button>
            <Button>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
