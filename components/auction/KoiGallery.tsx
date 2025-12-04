"use client";

export default function KoiGallery() {
  return (
    <div className="space-y-4 sticky top-20">
      <img
        src="/images/koi-sample.jpg" // nanti dinamis
        alt="koi"
        className="w-full rounded-lg object-cover"
      />
    </div>
  );
}
