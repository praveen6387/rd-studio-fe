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

const CreateNewMedia = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mediaType = watch("media_type");

    if (mediaType === "0" || mediaType === "1") {
      // Image or Video: single file only
      setSelectedFiles([files[0]]);
    } else if (mediaType === "2") {
      // FlipBook: multiple images only
      const imageFiles = files.filter(
        (file) => file.type.startsWith("image/") || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
      );
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus /> Create new Media
        </Button>
      </SheetTrigger>
      <SheetContent className="border-l-2 border-gray-200 !w-[500px] sm:!w-[600px] !max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-gray-900">Create New Media</SheetTitle>
          <SheetDescription className="text-gray-600">
            Add a new media item to your library. Fill in the details below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Media Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="media_type" className="text-gray-900">
              Media Type <span className="text-red-500">*</span>
            </Label>
            <Select value={watch("media_type")} onValueChange={handleMediaTypeChange}>
              <SelectTrigger className={errors.media_type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Image</SelectItem>
                <SelectItem value="1">Video</SelectItem>
                <SelectItem value="2">FlipBook</SelectItem>
              </SelectContent>
            </Select>
            {errors.media_type && <p className="text-xs text-red-500">{errors.media_type.message}</p>}
          </div>

          {/* Media Title */}
          <div className="space-y-2">
            <Label htmlFor="media_title" className="text-gray-900">
              Media Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="media_title"
              type="text"
              placeholder="Enter media title"
              className={errors.media_title ? "border-red-500" : ""}
              {...register("media_title", {
                onChange: () => clearErrors("media_title"),
              })}
            />
            {errors.media_title && <p className="text-xs text-red-500">{errors.media_title.message}</p>}
          </div>

          {/* Media Description */}
          <div className="space-y-2">
            <Label htmlFor="media_description" className="text-gray-900">
              Media Description
            </Label>
            <Textarea
              id="media_description"
              placeholder="Enter media description (optional)"
              className="min-h-[80px]"
              {...register("media_description")}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="files" className="text-gray-900">
              Upload Files <span className="text-red-500">*</span>
            </Label>
            <Label htmlFor="file-upload" className={watch("media_type") ? "cursor-pointer" : "cursor-not-allowed"}>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.files
                    ? "border-red-500"
                    : watch("media_type")
                    ? "border-gray-300 hover:border-gray-400"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <Upload className={`mx-auto h-12 w-12 ${watch("media_type") ? "text-gray-400" : "text-gray-300"}`} />
                <div className="mt-4">
                  <span className={`text-sm ${watch("media_type") ? "text-gray-600" : "text-gray-400"}`}>
                    {watch("media_type") ? "Click to upload or drag and drop" : "Select media type first"}
                  </span>
                  {watch("media_type") && (
                    <p className="text-xs text-gray-500 mt-1">
                      {watch("media_type") === "0"
                        ? "JPG, PNG, GIF, WebP up to 10MB"
                        : watch("media_type") === "1"
                        ? "MP4, AVI, MOV up to 100MB"
                        : "JPG, PNG, GIF, WebP (multiple images for FlipBook) up to 10MB each"}
                    </p>
                  )}
                </div>
              </div>
              <Input
                id="file-upload"
                type="file"
                multiple={watch("media_type") === "2"}
                className="hidden"
                onChange={handleFileChange}
                accept={watch("media_type") === "0" ? "image/*" : watch("media_type") === "1" ? "video/*" : "image/*"}
                disabled={!watch("media_type")}
              />
            </Label>
            {errors.files && <p className="text-xs text-red-500">{errors.files.message}</p>}
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-900">Selected Files</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700 truncate">{file?.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Media...
                </>
              ) : (
                "Create Media"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateNewMedia;
