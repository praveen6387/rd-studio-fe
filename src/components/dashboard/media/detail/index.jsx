"use client";
import React, { useMemo, useState, useEffect } from "react";
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
    return blobOrFile;
  }
};

const filenameFromUrl = (url) => {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    if (!last) return "file";
    return decodeURIComponent(last);
  } catch {
    try {
      const parts = url.split("?")[0].split("/");
      return parts[parts.length - 1] || "file";
    } catch {
      return "file";
    }
  }
};

const fetchUrlAsFile = async (url, nameHint) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch file: " + url);
  const blob = await res.blob();
  const type = blob?.type || "image/jpeg";
  const name = nameHint || filenameFromUrl(url) || "file";
  return new File([blob], name, { type, lastModified: Date.now() });
};

const DetailMediaIndex = ({ media }) => {
  const mediaData = media?.data || {};
  const items = mediaData?.media_library_items || [];
  console.log(mediaData);

  const [mediaType, setMediaType] = useState(String(mediaData?.media_type ?? ""));
  const [mediaTitle, setMediaTitle] = useState(mediaData?.media_title || "");
  const [mediaDescription, setMediaDescription] = useState(mediaData?.media_description || "");
  const [studioName, setStudioName] = useState(mediaData?.studio_name || "");
  const toDateInputValue = (dateLike) => {
    try {
      if (!dateLike) return "";
      const d = new Date(dateLike);
      if (Number.isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };
  const [eventDate, setEventDate] = useState(toDateInputValue(mediaData?.event_date));
  const [selectedFiles, setSelectedFiles] = useState(
    items.map((item) => ({
      id: item.id,
      file: null, // existing item; do not create fake File from URL
      isImage: true,
      status: "ready",
      progress: 100,
      previewUrl: item.media_url,
      isNew: false,
      name: item.media_item_title || filenameFromUrl(item.media_url),
    }))
  );
  const [viewMode, setViewMode] = useState("grid");
  const [draggingId, setDraggingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Hydrate existing items by fetching their URLs into real File objects once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Collect targets from latest state safely
      let targets = [];
      setSelectedFiles((prev) => {
        targets = prev.filter((it) => !it.isNew && !it.file && !!it.previewUrl);
        return prev;
      });
      if (!targets.length) return;
      const replacements = await Promise.all(
        targets.map(async (it) => {
          try {
            const f = await fetchUrlAsFile(it.previewUrl, it?.name || undefined);
            return { id: it.id, file: f };
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      setSelectedFiles((prev) =>
        prev.map((it) => {
          const rep = replacements.find((r) => r && r.id === it.id);
          return rep ? { ...it, file: rep.file } : it;
        })
      );
    })();
    return () => {
      cancelled = true;
    };
    // Re-run if items list changes (e.g., when navigating to a different media)
  }, [items]);

  // Simple image compression helper (targets ~100KB)
  const compressImageIfNeeded = async (file, onProgress) => {
    if (!(file instanceof File)) return file;
    if (!file.type?.startsWith("image/")) return file;
    try {
      const out = await imageCompression(file, {
        maxSizeMB: 0.1, // ~100KB
        useWebWorker: true,
        maxWidthOrHeight: 4096,
        onProgress: (p) => {
          if (typeof onProgress === "function") {
            try {
              onProgress(Math.max(0, Math.min(100, Math.round(p || 0))));
            } catch {}
          }
        },
      });
      // Always prefer the optimized output if available
      return out || file;
    } catch {
      return file;
    }
  };

  const resetToInitial = () => {
    setMediaType(String(mediaData?.media_type ?? ""));
    setMediaTitle(mediaData?.media_title || "");
    setMediaDescription(mediaData?.media_description || "");
    setStudioName(mediaData?.studio_name || "");
    setEventDate(toDateInputValue(mediaData?.event_date));
    setSelectedFiles(
      items.map((item) => ({
        id: item.id,
        file: null, // keep as reference; don't fabricate a File
        isImage: true,
        status: "ready",
        progress: 100,
        previewUrl: item.media_url,
        isNew: false,
        name: item.media_item_title || filenameFromUrl(item.media_url),
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
      if (studioName && studioName.trim() !== "") {
        formData.append("studio_name", studioName.trim());
      }
      if (eventDate) {
        formData.append("event_date", eventDate);
      }
      // Preserve user order and ensure filename is sent (avoid default "blob")
      console.log("selectedFiles", selectedFiles);
      // Append ALL files in current order
      selectedFiles.forEach((item) => {
        if (!(item?.file instanceof File)) {
          throw new Error("File missing for one or more items");
        }
        const filename = item.file.name || item?.name || "upload";
        formData.append("media_items", item.file, filename);
      });
      // Optionally send ordering and existing IDs if backend supports it
      try {
        const orderPayload = selectedFiles.map((item, index) => ({
          id: item.id,
          position: index,
        }));
        formData.append("order", JSON.stringify(orderPayload));
      } catch {}
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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    // Single image for mediaType "0"
    if (mediaType === "0") {
      const first = files[0];
      if (!first) {
        setSelectedFiles([]);
        return;
      }
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: first,
        isImage: true,
        status: "compressing",
        progress: 0,
        previewUrl: URL.createObjectURL(first),
        isNew: true,
      };
      setSelectedFiles([entry]);
      try {
        const compressed = await compressImageIfNeeded(first, (p) => {
          const entryId = entry.id;
          setSelectedFiles((prev) => prev.map((it) => (it.id === entryId ? { ...it, progress: p } : it)));
        });
        const entryId = entry.id;
        const finalFile = toFile(compressed, first.name, first.lastModified || Date.now());
        const newUrl = URL.createObjectURL(finalFile);
        setSelectedFiles((prev) =>
          prev.map((it) => {
            if (it.id !== entryId) return it;
            if (it.previewUrl && it.previewUrl !== newUrl) {
              try {
                URL.revokeObjectURL(it.previewUrl);
              } catch {}
            }
            return { ...it, file: finalFile, status: "ready", progress: 100, previewUrl: newUrl, isNew: true };
          })
        );
      } catch {
        const entryId = entry.id;
        setSelectedFiles((prev) =>
          prev.map((it) => (it.id === entryId ? { ...it, status: "ready", progress: 100 } : it))
        );
      }
      return;
    }
    // Multiple images for flipbook "2"
    if (mediaType === "2") {
      const imageFiles = files.filter(
        (file) => file.type.startsWith("image/") || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
      );
      if (!imageFiles.length) return;
      const placeholders = imageFiles.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        isImage: true,
        status: "compressing",
        progress: 0,
        previewUrl: URL.createObjectURL(f),
        isNew: true,
      }));
      setSelectedFiles((prev) => [...prev, ...placeholders]);
      // compress in background and update each placeholder
      placeholders.forEach(async (p, i) => {
        const placeholderId = p.id;
        const original = imageFiles[i];
        try {
          const compressed = await compressImageIfNeeded(original, (p) => {
            setSelectedFiles((prev) => prev.map((it) => (it.id === placeholderId ? { ...it, progress: p } : it)));
          });
          const finalFile = toFile(compressed, original.name, original.lastModified || Date.now());
          const newUrl = URL.createObjectURL(finalFile);
          setSelectedFiles((prev) =>
            prev.map((it) => {
              if (it.id !== placeholderId) return it;
              if (it.previewUrl && it.previewUrl !== newUrl) {
                try {
                  URL.revokeObjectURL(it.previewUrl);
                } catch {}
              }
              return { ...it, file: finalFile, status: "ready", progress: 100, previewUrl: newUrl, isNew: true };
            })
          );
        } catch {
          setSelectedFiles((prev) =>
            prev.map((it) => (it.id === placeholderId ? { ...it, status: "ready", progress: 100 } : it))
          );
        }
      });
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

  const fileAccept = "image/*";
  const fileMultiple = mediaType === "2";
  const isSubmitDisabled =
    !mediaTitle.trim() ||
    !mediaType ||
    selectedFiles.length === 0 ||
    selectedFiles.some((f) => f.status === "compressing" || !(f.file instanceof File));

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
    <DashboardPageLayout title="Media Detail" description="View Or Update Media">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="">
            <Input
              type="text"
              required
              label="Event Title"
              id="mediaTitle"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full"
              disabled={!isEditMode}
            />
          </div>
          <div className="">
            <Input
              type="date"
              label="Event Date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full"
              disabled={!isEditMode}
            />
          </div>
          <div className="">
            <Input
              type="text"
              label="Studio Name"
              id="studioName"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="Enter studio name"
              className="w-full"
              disabled={!isEditMode}
            />
          </div>

          <div className="">
            <Label htmlFor="mediaType">Media Type</Label>
            <Select value={mediaType} onValueChange={handleMediaTypeChange} disabled={!isEditMode || true}>
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
          <div className="col-span-full">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="mediaDescription">Event Description</Label>
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
                    const url = item?.previewUrl;
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
                    type: "Image",
                    sizeKB: item?.file?.size ? Math.round(item.file.size / 1024) : 0,
                    status: item.status,
                    progress: item.progress,
                    previewUrl: item?.previewUrl,
                    isImage: true,
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
                        return (
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
                            {row.original.status === "compressing" && (
                              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-1">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                <span className="text-[10px] text-gray-700">
                                  {typeof row.original.progress === "number" ? `${row.original.progress}%` : ""}
                                </span>
                              </div>
                            )}
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
