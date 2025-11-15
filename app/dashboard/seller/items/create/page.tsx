"use client";

import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Upload } from "lucide-react";

export default function CreateItemPage() {
  const [images, setImages] = useState<string[]>([]);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...previews]);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add New Item</h1>
        <p className="text-sm text-muted-foreground">
          Register your koi into your inventory.
        </p>
      </div>

      {/* FORM */}
      <Card className="rounded-xl border">
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Ex: Kohaku Jumbo" />
          </div>

          {/* VARIETY */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Variety</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select variety" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kohaku">Kohaku</SelectItem>
                <SelectItem value="Showa">Showa</SelectItem>
                <SelectItem value="Sanke">Sanke</SelectItem>
                <SelectItem value="Tancho">Tancho</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SIZE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Size (cm)</label>
            <Input type="number" placeholder="Ex: 60" />
          </div>

          {/* AGE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select age class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tosai">Tosai (1 year)</SelectItem>
                <SelectItem value="Nisai">Nisai (2 years)</SelectItem>
                <SelectItem value="Sansai">Sansai (3 years)</SelectItem>
                <SelectItem value="Yonsai">Yonsai (4 years)</SelectItem>
                <SelectItem value="Older">Older</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GENDER */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={4} placeholder="Optional notes about the koi..." />
          </div>

          {/* IMAGES */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photos</label>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border rounded-lg py-10 cursor-pointer hover:bg-muted/30 transition">
              <Upload className="size-6 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
              />
            </label>

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* STICKY FOOTER BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end">
        <Button className="gap-2">
          <Plus className="size-4" /> Save Item
        </Button>
      </div>
    </div>
  );
}
