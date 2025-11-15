"use client";

import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ItemGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <AspectRatio ratio={1 / 1} className="rounded-xl border overflow-hidden">
        <img
          src={active}
          className="object-cover w-full h-full"
          alt="Koi main image"
        />
      </AspectRatio>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <AspectRatio
            key={i}
            ratio={1 / 1}
            className={`rounded-md border overflow-hidden cursor-pointer ${
              active === img ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActive(img)}
          >
            <img
              src={img}
              className="object-cover w-full h-full"
              alt="Thumbnail"
            />
          </AspectRatio>
        ))}
      </div>
    </div>
  );
}
