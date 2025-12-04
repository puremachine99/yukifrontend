"use client";

export default function KoiBidPanel() {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-card">
      <div className="flex justify-between">
        <div className="text-green-400 font-semibold">OB: 27 ribu</div>
        <div className="text-white font-semibold">KB: 51 ribu</div>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-white">Jenis Lelang:</span> REGULER
      </div>

      <div className="text-white text-lg">
        37d 22h 23m 28s
      </div>

      <div className="rounded-lg bg-muted h-64" />

      {/* INPUT BID + ACTION */}
      <div className="flex items-center gap-3">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg">BIN</button>
        <button className="bg-gray-700 text-white w-10 h-10 rounded-lg">-</button>
        <div className="text-white w-20 text-center">27</div>
        <button className="bg-blue-600 text-white w-10 h-10 rounded-lg">+</button>
        <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg">Open Bid</button>
      </div>
    </div>
  );
}
