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

const CreateNewMedia = ({ current_user }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  console.log(current_user)
  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      media_type: "",
      media_title: "",
      media_description: "",
    },
  });


  return (
    <>
        <Button 
          className="cursor-pointer" 
          variant="secondary"
          // disabled={current_user?.remaining_credit <= 0}
        >
          <Link href="/dashboard/media/create" className="flex items-center gap-2">
            <Plus /> Create New Flipbook
          </Link>
        </Button>
    </>
  );
};

export default CreateNewMedia;
