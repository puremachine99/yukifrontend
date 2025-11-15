"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";

const pendingReviews = [
  {
    id: "REV-2101",
    seller: "Shinoda Koi Farm",
    item: "Kohaku Supreme 65cm",
    wonAt: "Mar 05, 2025",
  },
  {
    id: "REV-2098",
    seller: "Izumiya",
    item: "Showa Rising Star",
    wonAt: "Feb 28, 2025",
  },
];

const completedReviews = [
  {
    seller: "Dainichi",
    rating: 5,
    comment: "Excellent packing, koi arrived in perfect condition.",
    date: "Feb 15, 2025",
  },
  {
    seller: "Sakai Fish Farm",
    rating: 4,
    comment: "Responsive during handover. Shipping slightly delayed.",
    date: "Jan 30, 2025",
  },
];

export default function BidderReviewsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Reviews
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Seller Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Complete pending reviews to maintain trusted trading status
          </p>
        </div>

        <Badge variant="secondary" className="rounded-full px-4 py-2">
          {pendingReviews.length} pending
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.map((review) => (
            <Card key={review.id} className="rounded-2xl border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap items-center gap-2">
                  {review.seller}
                  <Badge variant="outline" className="rounded-full text-xs">{review.id}</Badge>
                </CardTitle>
                <CardDescription>
                  {review.item} • Won on {review.wonAt}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Share 1–2 sentences about shipping, communication, or koi condition.</p>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Button key={i} variant="outline" size="icon" className="rounded-full">
                      <Star className="size-4" />
                    </Button>
                  ))}
                </div>

                <Textarea placeholder="Leave feedback (UI only)" className="h-24" />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost">Skip</Button>
                  <Button>Submit Review</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingReviews.length === 0 && (
            <Card className="rounded-2xl border-dashed border p-10 text-center text-sm text-muted-foreground">
              No pending reviews. Great job staying up to date!
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedReviews.map((review, idx) => (
            <Card key={idx} className="rounded-2xl border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{review.seller}</CardTitle>
                <CardDescription>{review.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
