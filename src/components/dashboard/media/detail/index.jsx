"use client";
import React, { useMemo, useState } from "react";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Table as TableIcon, Pencil, Save, X, Upload, Loader2, GripVertical } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import DataTable from "@/components/shared/clientDataTable";
import toast from "react-hot-toast";
import { updateMedia } from "@/lib/api/client/media/urls";
import imageCompression from "browser-image-compression";

const toFile = (blobOrFile, name, lastModified = Date.now()) => {
  if (blobOrFile instanceof File) return blobOrFile;
  const type = blobOrFile?.type || "application/octet-stream";
  try {
    return new File([blobOrFile], name || "upload", { type, lastModified });
  } catch {
    // Fallback for very old browsers (unlikely in Next.js apps)
    return blobOrFile;
  }
};

const DetailMediaIndex = ({ media }) => {
  const mediaData = media?.data || {};
  const items = mediaData?.media_library_items || [];
  console.log(mediaData);

  const [mediaType, setMediaType] = useState(String(mediaData?.media_type ?? ""));
  const [mediaTitle, setMediaTitle] = useState(mediaData?.media_title || "");
  const [mediaDescription, setMediaDescription] = useState(mediaData?.media_description || "");
  const [selectedFiles, setSelectedFiles] = useState(
    items.map((item) => ({
      id: item.id,
      file: toFile(
        new Blob([item.media_url], { type: item.media_type === 0 ? "image/jpeg" : "video/mp4" }),
        item.media_item_title
      ),
      isImage: true,
      status: "ready",
      progress: 100,
      previewUrl: item.media_url,
    }))
  );
  const [viewMode, setViewMode] = useState("grid");
  const [draggingId, setDraggingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fast client-side compression keeping original dimensions, targeting <= 100 KB
  const compressImageFast = async (file, { maxBytes = 100 * 1024, onProgress } = {}) => {
    if (!(file instanceof File)) return file;
    if (!file.type?.startsWith("image/")) return file;
    if (file.size <= maxBytes) return file;

    const targetMB = Math.max(0.05, maxBytes / (1024 * 1024));
    const baseOptions = {
      maxSizeMB: targetMB,
      useWebWorker: true,
    };
    const qualities = [0.85, 0.7, 0.55, 0.4, 0.3];
    const totalAttempts = qualities.length + 1; // plus final fallback
    let best = null;
    for (let attemptIndex = 0; attemptIndex < qualities.length; attemptIndex++) {
      const q = qualities[attemptIndex];
      try {
        const out = await imageCompression(file, {
          ...baseOptions,
          initialQuality: q,
          onProgress: (p) => {
            const normalized = Math.min(
              100,
              Math.round(((attemptIndex + (typeof p === "number" ? p : 0) / 100) / totalAttempts) * 100)
            );
            onProgress?.(normalized);
          },
        });
        if (out && out.size <= maxBytes && out.size <= file.size) {
          onProgress?.(100);
          return out;
        }
        if (out && out.size < file.size) best = out;
      } catch {
        // try next quality
      }
    }
    if (best) {
      onProgress?.(100);
      return best;
    }
    try {
      const attemptIndex = qualities.length; // final attempt
      const last = await imageCompression(file, {
        ...baseOptions,
        initialQuality: 0.25,
        onProgress: (p) => {
          const normalized = Math.min(
            100,
            Math.round(((attemptIndex + (typeof p === "number" ? p : 0) / 100) / totalAttempts) * 100)
          );
          onProgress?.(normalized);
        },
      });
      if (last && last.size <= file.size) {
        onProgress?.(100);
        return last;
      }
    } catch {}
    onProgress?.(100);
    return file;
  };

  const resetToInitial = () => {
    setMediaType(String(mediaData?.media_type ?? ""));
    setMediaTitle(mediaData?.media_title || "");
    setMediaDescription(mediaData?.media_description || "");
    setSelectedFiles(
      items.map((item) => ({
        id: item.id,
        file: new File([], item.media_url, { type: item.media_type === 0 ? "image/jpeg" : "video/mp4" }),
        isImage: true,
        status: "ready",
        progress: 100,
        previewUrl: item.media_url,
      }))
    );
  };

  const handleCancelEdit = () => {
    resetToInitial();
    setIsEditMode(false);
  };

  const handleUpdateMedia = async () => {
    // Basic validations (mirror CreateNewMedia.jsx)
    if (!mediaType) {
      toast.error("Please select a media type", { position: "bottom-right" });
      return;
    }
    if (!mediaTitle || mediaTitle.trim() === "") {
      toast.error("Please enter a media title", { position: "bottom-right" });
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload", { position: "bottom-right" });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("media_type", mediaType);
      formData.append("media_title", mediaTitle.trim());
      if (mediaDescription && mediaDescription.trim() !== "") {
        formData.append("media_description", mediaDescription.trim());
      }
      // Preserve user order and ensure filename is sent (avoid default "blob")
      selectedFiles.forEach((item) => {
        const filename = item?.file?.name || "upload";
        formData.append("media_items", item.file, filename);
      });
      console.log(formData);

      await updateMedia(formData, mediaData.id);
      // await revalidateAPITag();

      toast.success("Media updated successfully!", { position: "bottom-right" });
      setIsEditMode(false);

      // Reset form
      // setSelectedFiles([]);
      // setMediaTitle("");
      // setMediaDescription("");
      // setMediaType("2");
    } catch (error) {
      console.error("Error updating media:", error);
      toast.error("Failed to update media. Please try again.", { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaTypeChange = (value) => {
    setMediaType(value);
    setSelectedFiles([]); // clear files when media type changes
  };

  const handleFileChange = async (e) => {
    console.log("called");
    const files = Array.from(e.target.files || []);
    console.log(files.length);
    if (!files.length) {
      // User canceled the dialog; keep previous selection intact
      return;
    }
    console.log(mediaType);
    if (mediaType === "0" || mediaType === "1") {
      const first = files[0];
      if (!first) {
        setSelectedFiles([]);
        return;
      }
      const isImage = first.type?.startsWith("image/");
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: first,
        isImage,
        status: isImage && mediaType === "0" ? "compressing" : "ready",
        progress: 0,
        previewUrl: isImage ? URL.createObjectURL(first) : null,
      };
      setSelectedFiles([entry]);
      if (isImage && mediaType === "0") {
        try {
          const compressed = await compressImageFast(first, {
            onProgress: (p) => {
              const entryId = entry.id;
              setSelectedFiles((prev) =>
                prev.map((it) => (it.id === entryId ? { ...it, progress: Math.round(p || 0) } : it))
              );
            },
          });
          const entryId = entry.id;
          const compressedFile = toFile(compressed, first.name, first.lastModified || Date.now());
          const newUrl = URL.createObjectURL(compressedFile);
          setSelectedFiles((prev) =>
            prev.map((it) => {
              if (it.id !== entryId) return it;
              if (it.previewUrl && it.previewUrl !== newUrl) {
                try {
                  URL.revokeObjectURL(it.previewUrl);
                } catch {}
              }
              return { ...it, file: compressedFile, status: "ready", progress: 100, previewUrl: newUrl };
            })
          );
        } catch {
          const entryId = entry.id;
          setSelectedFiles((prev) => prev.map((it) => (it.id === entryId ? { ...it, status: "ready" } : it)));
        }
      }
    } else if (mediaType === "2") {
      const imageFiles = files.filter(
        (file) => file.type.startsWith("image/") || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
      );
      if (imageFiles.length) {
        // append placeholders with preview and start compressing each
        const placeholders = imageFiles.map((f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file: f,
          isImage: true,
          status: "compressing",
          progress: 0,
          previewUrl: URL.createObjectURL(f),
        }));
        // append, then compress each sequentially per item
        setSelectedFiles((prev) => [...prev, ...placeholders]);
        // compress in background, update each based on its absolute index
        placeholders.forEach(async (p, i) => {
          const placeholderId = p.id;
          const original = imageFiles[i];
          try {
            const compressed = await compressImageFast(original, {
              onProgress: (p) => {
                setSelectedFiles((prev) =>
                  prev.map((it) => (it.id === placeholderId ? { ...it, progress: Math.round(p || 0) } : it))
                );
              },
            });
            const compressedFile = toFile(compressed, original.name, original.lastModified || Date.now());
            const newUrl = URL.createObjectURL(compressedFile);
            setSelectedFiles((prev) =>
              prev.map((it) => {
                if (it.id !== placeholderId) return it;
                if (it.previewUrl && it.previewUrl !== newUrl) {
                  try {
                    URL.revokeObjectURL(it.previewUrl);
                  } catch {}
                }
                return { ...it, file: compressedFile, status: "ready", progress: 100, previewUrl: newUrl };
              })
            );
          } catch {
            setSelectedFiles((prev) => prev.map((it) => (it.id === placeholderId ? { ...it, status: "ready" } : it)));
          }
        });
      }
    }
  };

  const removeFileAt = (indexOrId) => {
    setSelectedFiles((prev) => {
      let toRemove;
      let next = prev;
      if (typeof indexOrId === "number") {
        toRemove = prev[indexOrId];
        next = prev.filter((_, i) => i !== indexOrId);
      } else {
        toRemove = prev.find((it) => it.id === indexOrId);
        next = prev.filter((it) => it.id !== indexOrId);
      }
      if (toRemove?.previewUrl) {
        try {
          URL.revokeObjectURL(toRemove.previewUrl);
        } catch {}
      }
      return next;
    });
  };

  const fileAccept = mediaType === "1" ? "video/*" : "image/*";
  const fileMultiple = mediaType === "2";
  const isSubmitDisabled =
    !mediaTitle.trim() ||
    !mediaType ||
    selectedFiles.length === 0 ||
    selectedFiles.some((f) => f.status === "compressing");

  const moveItem = (list, fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return list;
    const fromIndex = list.findIndex((it) => it.id === fromId);
    const toIndex = list.findIndex((it) => it.id === toId);
    if (fromIndex === -1 || toIndex === -1) return list;
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    return updated;
  };

  return (
    <DashboardPageLayout title="Create Media" description="Create a new media">
      <div className="space-y-6">
        <div className="flex items-center justify-end gap-2">
          {!isEditMode ? (
            <Button type="button" size="sm" onClick={() => setIsEditMode(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit} disabled={isLoading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleUpdateMedia} disabled={isSubmitDisabled || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Update
              </Button>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              required
              label="Media Title"
              id="mediaTitle"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full"
              disabled={!isEditMode}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-y-2">
            <Label htmlFor="mediaType">Media Type</Label>
            <Select value={mediaType} onValueChange={handleMediaTypeChange} disabled={!isEditMode}>
              <SelectTrigger className="w-full" disabled={!isEditMode}>
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Image</SelectItem>
                <SelectItem value="1">Video</SelectItem>
                <SelectItem value="2">Flipbook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="mediaDescription">Media Description</Label>
              <Textarea
                id="mediaDescription"
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                placeholder="Optional description"
                className="min-h-[80px]"
                disabled={!isEditMode}
              />
            </div>
          </div>
        </div>

        {isEditMode && (
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Files</Label>
            <Label
              htmlFor="file-upload"
              className={mediaType && isEditMode ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"}
            >
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  mediaType ? "border-gray-300 hover:border-gray-400" : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <Upload className={`mx-auto h-12 w-12 ${mediaType ? "text-gray-400" : "text-gray-300"}`} />
                <div className="mt-4">
                  <span className={`text-sm ${mediaType ? "text-gray-600" : "text-gray-400"}`}>
                    {mediaType ? "Click to upload or drag and drop" : "Select media type first"}
                  </span>
                  {mediaType && (
                    <p className="text-xs text-gray-500 mt-1">
                      {mediaType === "0"
                        ? "JPG, PNG, GIF, WebP up to ~10MB"
                        : mediaType === "1"
                        ? "MP4, AVI, MOV up to ~100MB"
                        : "JPG, PNG, GIF, WebP (multiple images for Flipbook), up to ~10MB each"}
                    </p>
                  )}
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple={fileMultiple}
                className="hidden"
                accept={fileAccept}
                onChange={handleFileChange}
                disabled={!mediaType}
              />
            </Label>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <Label>Selected Files</Label>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)} className="gap-2">
                <ToggleGroupItem
                  value="grid"
                  aria-label="Grid view"
                  className="px-2 py-1 border"
                  data-state={viewMode === "grid" ? "on" : "off"}
                >
                  <div className="flex items-center gap-1 text-sm">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Grid</span>
                  </div>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="table"
                  aria-label="Table view"
                  className="px-2 py-1 border"
                  data-state={viewMode === "table" ? "on" : "off"}
                >
                  <div className="flex items-center gap-1 text-sm">
                    <TableIcon className="h-4 w-4" />
                    <span>Table</span>
                  </div>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {viewMode === "grid" && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {selectedFiles.map((item, index) => {
                    const isImage = item?.isImage;
                    const url = isImage ? item?.previewUrl : null;
                    return (
                      <div
                        key={`${item?.file?.name}-${index}`}
                        className={`relative border rounded-lg overflow-hidden bg-gray-50 ${
                          draggingId === item.id ? "ring-2 ring-blue-400" : ""
                        }`}
                        draggable={isEditMode}
                        onDragStart={isEditMode ? () => setDraggingId(item.id) : undefined}
                        onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
                        onDrop={
                          isEditMode
                            ? () => {
                                if (draggingId) {
                                  setSelectedFiles((prev) => moveItem(prev, draggingId, item.id));
                                  setDraggingId("");
                                }
                              }
                            : undefined
                        }
                        onDragEnd={isEditMode ? () => setDraggingId("") : undefined}
                      >
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => removeFileAt(index)}
                            className="absolute right-1 top-1 z-10 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                            aria-label="Remove file"
                          >
                            <X className="h-4 w-4 text-gray-700" />
                          </button>
                        )}
                        {isImage ? (
                          <div className="aspect-4/3 w-full bg-white relative">
                            {url ? (
                              <img
                                src={url}
                                alt={item?.file?.name || "preview"}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                            {item.status === "compressing" && (
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                                <span className="text-xs text-gray-700">
                                  Optimizing{typeof item.progress === "number" ? ` ${item.progress}%` : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32 text-sm text-gray-600">
                            Video selected
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-xs text-gray-700 truncate" title={item?.file?.name}>
                            {item?.file?.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "table" && (
              <div className="space-y-2">
                <DataTable
                  showFilter={false}
                  data={selectedFiles.map((item) => ({
                    id: item.id,
                    name: item?.file?.name || "",
                    type: item?.isImage ? "Image" : "Video",
                    sizeKB: item?.file?.size ? Math.round(item.file.size / 1024) : 0,
                    status: item.status,
                    progress: item.progress,
                    previewUrl: item?.previewUrl,
                    isImage: item?.isImage,
                  }))}
                  columns={[
                    {
                      header: "",
                      id: "reorder",
                      enableSorting: false,
                      cell: ({ row }) => (
                        <button
                          type="button"
                          aria-label="Reorder"
                          className={`h-8 w-8 flex items-center justify-center rounded ${
                            isEditMode ? "cursor-move" : "cursor-not-allowed"
                          } ${draggingId === row.original.id ? "ring-2 ring-blue-400" : ""}`}
                          disabled={!isEditMode}
                          draggable={isEditMode}
                          onDragStart={isEditMode ? () => setDraggingId(row.original.id) : undefined}
                          onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
                          onDrop={
                            isEditMode
                              ? () => {
                                  if (draggingId) {
                                    setSelectedFiles((prev) => moveItem(prev, draggingId, row.original.id));
                                    setDraggingId("");
                                  }
                                }
                              : undefined
                          }
                          onDragEnd={isEditMode ? () => setDraggingId("") : undefined}
                        >
                          <GripVertical className="h-4 w-4 text-gray-600" />
                        </button>
                      ),
                    },
                    {
                      header: "Preview",
                      accessorKey: "previewUrl",
                      enableSorting: false,
                      cell: ({ row }) => {
                        const url = row.original.previewUrl;
                        const isImage = row.original.isImage;
                        const status = row.original.status;
                        const progress = row.original.progress;
                        return isImage ? (
                          <div
                            className={`h-12 w-16 bg-white border overflow-hidden rounded relative ${
                              draggingId === row.original.id ? "ring-2 ring-blue-400" : ""
                            }`}
                            draggable={isEditMode}
                            onDragStart={isEditMode ? () => setDraggingId(row.original.id) : undefined}
                            onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
                            onDrop={
                              isEditMode
                                ? () => {
                                    if (draggingId) {
                                      setSelectedFiles((prev) => moveItem(prev, draggingId, row.original.id));
                                      setDraggingId("");
                                    }
                                  }
                                : undefined
                            }
                            onDragEnd={isEditMode ? () => setDraggingId("") : undefined}
                          >
                            {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : null}
                            {status === "compressing" && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-12 w-16 bg-gray-100 border rounded flex items-center justify-center text-[10px]">
                            Video
                          </div>
                        );
                      },
                    },
                    {
                      header: "Name",
                      accessorKey: "name",
                      enableSorting: false,
                      cell: ({ row }) => (
                        <div className="max-w-[280px] truncate" title={row.original.name}>
                          {row.original.name}
                        </div>
                      ),
                    },
                    {
                      header: "Size",
                      accessorKey: "sizeKB",
                      enableSorting: false,
                      cell: ({ row }) => <span>{row.original.sizeKB} KB</span>,
                    },
                    {
                      header: "Status",
                      accessorKey: "status",
                      enableSorting: false,
                      cell: ({ row }) =>
                        row.original.status === "compressing" ? (
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                            <span>
                              Optimizing{typeof row.original.progress === "number" ? ` ${row.original.progress}%` : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-green-700">Ready</span>
                        ),
                    },
                    {
                      header: "Action",
                      id: "action",
                      enableSorting: false,
                      cell: ({ row }) => (
                        <div className="text-right">
                          {isEditMode && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFileAt(row.original.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardPageLayout>
  );
};

export default DetailMediaIndex;
