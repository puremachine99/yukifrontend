import { LiveLotCard } from "./live-lot-card";

interface Props {
  lots: Array<any>;
}

export function LiveLotGrid({ lots }: Props) {
  if (!lots.length) {
    return (
      <div className="rounded-3xl border border-white/20 bg-white/5 p-16 text-center text-lg text-slate-300">
        Belum ada koi live saat ini.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {lots.map((x) => (
        <LiveLotCard
          key={`${x.auctionId}-${x.itemId}`}
          auctionId={x.auctionId}
          breeder={x.breeder}
          itemId={x.itemId}
          image={x.image}
          name={x.name}
          variety={x.variety}
          size={x.size}
          start={x.start}
          end={x.end}
          watchers={x.watchers}
          lastBid={x.lastBid}
          openBid={x.openBid}
          increment={x.increment}
          buyNow={x.buyNow}
          bidCount={x.bidCount}
        />
      ))}
    </div>
  );
}
