"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";

const dummyItem = {
  id: 1,
  name: "Kohaku Jumbo",
  size: 72,
  variety: "Kohaku",
  gender: "Female",
  age: "Sansai (3y)",
  description:
    "A premium Kohaku with deep hi pattern and strong body shape. Imported from Dainichi.",
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
};

export default function EditItemPage() {
  const router = useRouter();

  const [name, setName] = useState(dummyItem.name);
  const [size, setSize] = useState(dummyItem.size);
  const [variety, setVariety] = useState(dummyItem.variety);
  const [age, setAge] = useState(dummyItem.age);
  const [gender, setGender] = useState(dummyItem.gender);
  const [description, setDescription] = useState(dummyItem.description);
  const [images, setImages] = useState<string[]>(dummyItem.images);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
  };

  const onSave = () => {
    // UI only — so just route back
    router.push(`/dashboard/seller/items/${dummyItem.id}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Item</h1>
          <p className="text-sm text-muted-foreground">
            Update koi information and images.
          </p>
        </div>
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
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Kohaku Jumbo"
            />
          </div>

          {/* VARIETY */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Variety</label>
            <Select value={variety} onValueChange={setVariety}>
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
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          {/* AGE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <Select value={age} onValueChange={setAge}>
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
            <Select value={gender} onValueChange={setGender}>
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
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about the koi..."
            />
          </div>

          {/* IMAGES */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photos</label>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border rounded-lg py-10 cursor-pointer hover:bg-muted/30 transition">
              <Upload className="size-6 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload more images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
              />
            </label>

            {/* Gallery preview */}
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

      {/* STICKY SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end">
        <Button className="gap-2" onClick={onSave}>
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
