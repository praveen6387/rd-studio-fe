import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { createMedia } from "@/lib/api/client/media/urls";
import { revalidateAPITag } from "@/lib/actions/media";
import imageCompression from "browser-image-compression";
import Link from "next/link";

// Fast client-side compression using browser-image-compression (keeps dimensions)
const compressImageFast = async (file, { maxBytes = 400 * 1024, onProgress } = {}) => {
  if (!(file instanceof File)) return file;
  if (!file.type?.startsWith("image/")) return file;
  if (file.size <= maxBytes) return file;

  const targetMB = Math.max(0.05, maxBytes / (1024 * 1024));
  const options = {
    maxSizeMB: targetMB,
    useWebWorker: true,
    // no resizing; we keep original width/height
  };

  const qualities = [0.85, 0.7, 0.55, 0.4, 0.3];
  let best = null;
  for (const q of qualities) {
    try {
      const out = await imageCompression(file, { ...options, initialQuality: q, onProgress });
      if (out && out.size <= maxBytes && out.size <= file.size) return out;
      if (out && out.size < file.size) best = out;
    } catch {
      // try next
    }
  }
  if (best) return best;
  try {
    const last = await imageCompression(file, { ...options, initialQuality: 0.25, onProgress });
    if (last && last.size <= file.size) return last;
  } catch {}
  return file;
};

const CreateNewMedia = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      media_type: "",
      media_title: "",
      media_description: "",
    },
  });

  const onSubmit = async (data) => {
    // Validation: Check if media type is selected
    if (!data.media_type) {
      setError("media_type", {
        type: "manual",
        message: "Please select a media type",
      });
      return;
    }

    // Validation: Check if media title is provided
    if (!data.media_title || data.media_title.trim() === "") {
      setError("media_title", {
        type: "manual",
        message: "Please enter a media title",
      });
      return;
    }

    // Validation: Check if files are selected
    if (selectedFiles.length === 0) {
      setError("files", {
        type: "manual",
        message: "Please select at least one file to upload",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("media_type", data.media_type);
      formData.append("media_title", data.media_title.trim());
      if (data.media_description && data.media_description.trim() !== "") {
        formData.append("media_description", data.media_description.trim());
      }

      selectedFiles.forEach((file) => {
        formData.append("media_items", file);
      });

      const res = await createMedia(formData);

      // Revalidate the media library cache
      await revalidateAPITag();

      // Show success toast
      toast.success("Media created successfully!", {
        duration: 4000,
        position: "bottom-right",
      });

      // Reset form after successful upload
      setSelectedFiles([]);
      reset();

      // Close the sheet after successful upload
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating media:", error);

      // Show error toast
      toast.error("Failed to create media. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const mediaType = watch("media_type");

    if (mediaType === "0" || mediaType === "1") {
      // Image or Video: single file only
      const first = files[0];
      if (!first) {
        setSelectedFiles([]);
      } else if (mediaType === "0" && first.type.startsWith("image/")) {
        try {
          setIsCompressing(true);
          setCompressionProgress(0);
          const compressed = await compressImageFast(first, {
            onProgress: (p) => setCompressionProgress(Math.round(p || 0)),
          });
          setSelectedFiles([compressed]);
        } catch {
          setSelectedFiles([first]);
        } finally {
          setIsCompressing(false);
        }
      } else {
        setSelectedFiles([first]);
      }
    } else if (mediaType === "2") {
      // FlipBook: multiple images only
      const imageFiles = files.filter(
        (file) => file.type.startsWith("image/") || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
      );
      if (imageFiles.length === 0) {
        setSelectedFiles((prev) => prev);
      } else {
        try {
          setIsCompressing(true);
          setCompressionProgress(0);
          const compressedList = await Promise.all(imageFiles.map((f) => compressImageFast(f)));
          setSelectedFiles((prev) => [...prev, ...compressedList]);
        } catch {
          setSelectedFiles((prev) => [...prev, ...imageFiles]);
        } finally {
          setIsCompressing(false);
          setCompressionProgress(0);
        }
      }
    }
    // Clear validation error when user selects files
    clearErrors("files");
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMediaTypeChange = (value) => {
    setValue("media_type", value);
    setSelectedFiles([]); // Clear files when media type changes
    // Clear validation error when user selects a media type
    clearErrors("media_type");
  };

  return (
    <>
      <Link href="/dashboard/media/create">
        <Button className="flex items-center gap-2 cursor-pointer" variant="secondary">
          <Plus /> Create New Flipbook
        </Button>
      </Link>
    </>
  );
};

export default CreateNewMedia;
