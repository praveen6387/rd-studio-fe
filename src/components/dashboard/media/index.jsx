"use client";
import DataTable from "@/components/shared/clientDataTable";
import { Badge } from "@/components/ui/badge";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import React, { useState } from "react";
import CreateNewMedia from "./_builder/CreateNewMedia";
import QRModal from "./_builder/QRModal";
import { convertTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ViewMediaModalV2 from "./_builder/ViewMediaModalV2";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteMedia } from "@/lib/api/client/media/urls";
import toast from "react-hot-toast";

const MediaIndex = ({ mediaLibrary }) => {
  const [data, setData] = useState(mediaLibrary?.data);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrMediaData, setQrMediaData] = useState(null);

  const handleViewMedia = (mediaData) => {
    setSelectedMedia(mediaData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  const handleOpenQRModal = (mediaData) => {
    setQrMediaData(mediaData);
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
    setQrMediaData(null);
  };

  const handleDeleteMedia = async (mediaData) => {
    try {
      await deleteMedia(mediaData.id);
      setData(data.filter((item) => item.id !== mediaData.id));
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Failed to delete media", {
        duration: 3000,
        position: "bottom-right",
      });
    }
    toast.success("Media deleted successfully", {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const columns = [
    {
      header: "Media",
      accessorKey: "media_title",
      cell: ({ row }) => {
        const mediaLibraryItem = row.original.media_library_items?.[0];
        const title = row.original.media_title || mediaLibraryItem?.media_item_title || "-";
        const description = row.original.media_description || mediaLibraryItem?.media_item_description;

        return (
          <div className="space-y-1">
            <p className="font-medium text-sm text-slate-900 line-clamp-1">{title}</p>
            {description && <p className="text-xs text-slate-500 line-clamp-2">{description}</p>}
          </div>
        );
      },
    },
    {
      header: "Type / ID",
      accessorKey: "media_type_name",
      meta: {
        filterVariant: "custom-select",
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="success" className="text-[11px] px-2 py-0.5 rounded-full">
            {row.original.media_type_name || "Unknown"}
          </Badge>
          <p className="text-[11px] font-mono text-slate-500 break-all">{row.original.media_unique_id}</p>
        </div>
      ),
    },
    {
      header: "Created",
      accessorKey: "created_at",
      meta: {
        filterVariant: "date-range",
      },
      cell: ({ row }) => {
        const createdBy = row.original.created_by_name || row.original.created_by || "Ankit Maurya";

        return (
          <div className="space-y-1">
            {createdBy && <p className="font-medium text-sm text-slate-900 line-clamp-1">{createdBy}</p>}
            <p className="text-xs text-slate-500">{convertTime(row.original.created_at)}</p>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => handleViewMedia(row.original)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => handleOpenQRModal(row.original)}
          >
            QR
          </Button>
          <Link href={`/dashboard/media/detail/${row.original.id}`}>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
              Detail
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => handleDeleteMedia(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardPageLayout title="Media" description="Manage your media" button={<CreateNewMedia />}>
      <DataTable data={data} columns={columns} />
      <ViewMediaModalV2 isOpen={isModalOpen} onClose={handleCloseModal} mediaData={selectedMedia} />
      <QRModal isOpen={isQRModalOpen} onClose={handleCloseQRModal} mediaData={qrMediaData} />
    </DashboardPageLayout>
  );
};

export default MediaIndex;
