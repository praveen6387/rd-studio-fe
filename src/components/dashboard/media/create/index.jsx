"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Grip } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createMedia } from "@/lib/api/client/media/urls";
import { Loader2 } from "lucide-react";

// Reusable, styled upload card used for Front / Back / Remaining sections
const ImageTypeBlock = ({
  title,
  images,
  onChange,
  onReorder = () => {},
  onBringToTop = () => {},
  optimizationPercent = 0,
  thumbSize = "h-20 w-20",
}) => {
  const inputRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Helper to reorder an array (pure)
  const reorderArray = (arr, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return arr.slice();
    const copy = arr.slice();
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    // Create a synthetic event that matches the shape handlers expect
    const synthetic = { target: { files } };
    onChange(synthetic);
  };

  // Drag and drop between thumbnails
  const handleThumbDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleThumbDrop = (e, targetIndex) => {
    e.preventDefault();
    const src = e.dataTransfer.getData("text/plain");
    if (src === "") return;
    const fromIndex = Number(src);
    if (Number.isNaN(fromIndex)) return;
    const newOrder = reorderArray(images, fromIndex, targetIndex);
    onReorder(newOrder);
  };

  const handleBringToTop = (index) => {
    const newOrder = reorderArray(images, index, 0);
    onBringToTop(newOrder);
  };

  console.log(images);

  return (
    <div className="w-full">
      {/* <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700">{title}</div>
        <div>
          {optimizationPercent > 0 ? (
            <div className="text-xs text-indigo-700 px-2 py-1 rounded-full">Optimizing {optimizationPercent}%</div>
          ) : (
            images.length > 0 && (
              <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                {images.length} selected
              </div>
            )
          )}
        </div>
      </div> */}

      <div className="bg-white/80 rounded-xl shadow-sm p-4">
        {/* Thumbnails */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium text-gray-700">{title}</div>
          <div>
            {optimizationPercent > 0 ? (
              <div className="text-xs text-indigo-700 px-2 py-1 rounded-full">Optimizing {optimizationPercent}%</div>
            ) : (
              images.length > 0 && (
                <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                  {images.length} selected
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-3 flex-wrap  pb-2">
          {images.length > 0 ? (
            images.map((img, idx) => (
              <div key={idx}>
                <div
                  key={`${title}-${idx}`}
                  draggable
                  onDragStart={(e) => handleThumbDragStart(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleThumbDrop(e, idx)}
                  className="relative"
                >
                  <Image
                    width={40}
                    height={10}
                    src={img.preview}
                    alt={`${title} ${idx + 1}`}
                    className={`${thumbSize} rounded object-cover border min-w-20`}
                  />
                  <button
                    type="button"
                    onClick={() => handleBringToTop(idx)}
                    className="absolute top-0 right-0 bg-white/90 text-xs px-0.5 py-0.5 rounded shadow"
                    title="Bring to top"
                  >
                    <Grip className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-xs text-gray-600">{img.file.name}</div>
              </div>
            ))
          ) : (
            <div key={"test"} className="text-sm text-gray-400 italic">
              No images selected yet
            </div>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" multiple onChange={onChange} className="hidden" />

        <div
          onDragOver={onDragOver}
          onDrop={handleFileDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
          className="relative flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 16V4" />
              <path d="M8 8l4-4 4 4" />
              <path d="M20 12v7H4v-7" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-gray-800">Click to upload or drag & drop</div>
          <div className="text-sm text-gray-500">JPG, PNG, GIF, WebP — you can add multiple images</div>
        </div>
      </div>
    </div>
  );
};

// Image compression helpers
const compressImageFile = async (file, targetKB = 100) => {
  const targetBytes = targetKB * 1024;
  const mimePrefer = file.type || "image/jpeg";
  // create image bitmap
  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  const maxWidth = 1920;
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const tryCompress = async (w, h, mime, quality) => {
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    return await new Promise((res) => canvas.toBlob(res, mime, quality));
  };

  // try decreasing quality, then reduce dimensions if needed
  let qualitySteps = [0.92, 0.85, 0.7, 0.55, 0.4, 0.3];
  let currentWidth = width;
  let currentHeight = height;
  let blob = null;
  let mime = mimePrefer;

  for (let dimAttempts = 0; dimAttempts < 6; dimAttempts++) {
    for (let q of qualitySteps) {
      // prefer webp/jpeg for compression
      try {
        blob = await tryCompress(currentWidth, currentHeight, mime, q);
      } catch (err) {
        blob = null;
      }
      if (!blob) continue;
      if (blob.size <= targetBytes) return blob;
    }
    // reduce size by 0.85 and retry
    currentWidth = Math.max(400, Math.round(currentWidth * 0.85));
    currentHeight = Math.max(400, Math.round(currentHeight * 0.85));
  }

  // fallback: return original file as blob
  return file;
};

const optimizeFiles = async (files, setProgress, targetKB = 100) => {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    try {
      const blobOrFile = await compressImageFile(f, targetKB);
      const outFile =
        blobOrFile instanceof File ? blobOrFile : new File([blobOrFile], f.name, { type: blobOrFile.type || f.type });
      const preview = URL.createObjectURL(outFile);
      results.push({ file: outFile, preview });
    } catch (err) {
      // on error, fall back to original
      const preview = URL.createObjectURL(f);
      results.push({ file: f, preview });
    }
    setProgress(Math.round(((i + 1) / files.length) * 100));
    // small yield so UI updates smoothly
    await new Promise((r) => setTimeout(r, 50));
  }
  return results;
};

export default function CreateMediaIndex() {
  const [mediaTitle, setMediaTitle] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [frontImages, setFrontImages] = useState([]);
  const [backImages, setBackImages] = useState([]);
  const [mediaImages, setMediaImages] = useState([]);

  const [frontImagesOptimizationPercetage, setFrontImagesOptimizationPercetage] = useState(0);
  const [backImagesOptimizationPercetage, setBackImagesOptimizationPercetage] = useState(0);
  const [mediaImagesOptimizationPercetage, setMediaImagesOptimizationPercetage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Unified handler for front/back/media upload inputs.
  // Call as: onChange={handleImagesChange("front")}
  const handleImagesChange = (type) => async (e) => {
    const files = Array.from(e.target.files || []);
    const images = files.filter((f) => f.type && f.type.startsWith("image/"));
    if (!images.length) return;

    if (type === "front") {
      setFrontImagesOptimizationPercetage(0);
      const optimized = await optimizeFiles(images, setFrontImagesOptimizationPercetage, 100);
      frontImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setFrontImages(optimized);
      // hide progress after short delay
      setTimeout(() => setFrontImagesOptimizationPercetage(0), 600);
    } else if (type === "back") {
      setBackImagesOptimizationPercetage(0);
      const optimized = await optimizeFiles(images, setBackImagesOptimizationPercetage, 100);
      backImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setBackImages(optimized);
      setTimeout(() => setBackImagesOptimizationPercetage(0), 600);
    } else if (type === "media") {
      setMediaImagesOptimizationPercetage(0);
      const optimized = await optimizeFiles(images, setMediaImagesOptimizationPercetage, 100);
      mediaImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setMediaImages(optimized);
      setTimeout(() => setMediaImagesOptimizationPercetage(0), 600);
    }
  };

  const handleCreateFlipbook = async () => {
    // Basic validations (mirror CreateNewMedia.jsx)
    if (!mediaTitle || mediaTitle.trim() === "") {
      toast.error("Please enter a media title", { position: "bottom-right" });
      return;
    }

    if (!eventDate) {
      toast.error("Please select event data", { position: "bottom-right" });
      return;
    }

    if (frontImages.length === 0 || backImages.length === 0 || mediaImages.length === 0) {
      toast.error("Please select at least one image for front cover, back cover and remaining media", {
        position: "bottom-right",
      });
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("media_title", mediaTitle);
      formData.append("event_date", eventDate);
      formData.append("media_type", "2");
      // formData.append("back_images", backImages);
      // formData.append("media_images", mediaImages);
      frontImages.forEach((item) => {
        const filename = item?.file?.name || "upload";
        formData.append("media_items", item.file, `0_${filename}`);
      });
      mediaImages.forEach((item) => {
        const filename = item?.file?.name || "upload";
        formData.append("media_items", item.file, `1_${filename}`);
      });
      backImages.forEach((item) => {
        const filename = item?.file?.name || "upload";
        formData.append("media_items", item.file, `2_${filename}`);
      });

      const res = await createMedia(formData);
      toast.success("Media created successfully!", { position: "bottom-right" });
    } catch (error) {
      console.error("Error creating flipbook:", error);
      toast.error("Failed to create flipbook. Please try again.", { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardPageLayout title="Create Flipbook" description="Fill in the details below and upload your images">
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 w-full max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flipbook Title</label>
            <Input
              type="text"
              id="mediaTitle"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
            <Input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ImageTypeBlock
            title="Front Cover"
            images={frontImages}
            onChange={handleImagesChange("front")}
            onReorder={(newImgs) => setFrontImages(newImgs)}
            onBringToTop={(newImgs) => setFrontImages(newImgs)}
            optimizationPercent={frontImagesOptimizationPercetage}
            thumbSize="h-24 w-24"
          />
          <ImageTypeBlock
            title="Back Cover"
            images={backImages}
            onChange={handleImagesChange("back")}
            onReorder={(newImgs) => setBackImages(newImgs)}
            onBringToTop={(newImgs) => setBackImages(newImgs)}
            optimizationPercent={backImagesOptimizationPercetage}
            thumbSize="h-24 w-24"
          />
          <ImageTypeBlock
            title="Remaining Media"
            images={mediaImages}
            onChange={handleImagesChange("media")}
            onReorder={(newImgs) => setMediaImages(newImgs)}
            onBringToTop={(newImgs) => setMediaImages(newImgs)}
            optimizationPercent={mediaImagesOptimizationPercetage}
            thumbSize="h-20 w-20"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleCreateFlipbook}
            className="bg-indigo-600 cursor-pointer text-white px-5 py-2 rounded-md shadow hover:bg-indigo-700 transition"
          >
            {isLoading ? `${(<Loader2 className="animate-spin" />)}Creating...` : "Create Flipbook"}
          </button>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
