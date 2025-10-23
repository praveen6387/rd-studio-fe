"use client";
import DataTable from "@/components/shared/clientDataTable";
import { Badge } from "@/components/ui/badge";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import React, { useState } from "react";
import CreateNewMedia from "./_builder/CreateNewMedia";
import ViewMediaModal from "./_builder/ViewMediaModal";
import QRModal from "./_builder/QRModal";
import { convertTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MediaIndex = ({ mediaLibrary }) => {
  const data = mediaLibrary?.data;
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
  const columns = [
    {
      header: "ID",
      accessorKey: "media_unique_id",
    },
    {
      header: "Media Title",
      accessorKey: "media_item_title",
      cell: ({ row }) => {
        const media_library_items = row.original.media_library_items?.[0];
        return (
          <div className="">
            <div className="text-ellipsis overflow-hidden w-[200px] whitespace-nowrap">
              {row.original.media_title || media_library_items?.media_item_title || "-"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Media Description",
      accessorKey: "media_item_description",
      cell: ({ row }) => {
        const media_library_items = row.original.media_library_items?.[0];
        return (
          <div className="">
            <div className="text-ellipsis overflow-hidden w-[250px] whitespace-nowrap">
              {row.original.media_description || media_library_items?.media_item_description || "-"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Media Type",
      accessorKey: "media_type_name",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.media_type_name}</Badge>;
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <div className=" text-sm text-gray-600">{convertTime(row.original.created_at)}</div>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="gap-2">
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
          </div>
        );
      },
    },
  ];

  return (
    <DashboardPageLayout title="Media" description="Manage your media" button={<CreateNewMedia />}>
      <DataTable data={data} columns={columns} />
      <ViewMediaModal isOpen={isModalOpen} onClose={handleCloseModal} mediaData={selectedMedia} />
      <QRModal isOpen={isQRModalOpen} onClose={handleCloseQRModal} mediaData={qrMediaData} />
    </DashboardPageLayout>
  );
};

export default MediaIndex;
