import React from "react";
import MediaViewModal from "@/components/utils/mediaViewModal";

const ViewMediaModalV2 = ({ isOpen, onClose, mediaData }) => {
  if (!mediaData || !isOpen) return null;
  console.log(mediaData);

  return (
    <div>
      <MediaViewModal data={mediaData} open={isOpen} onOpenChange={onClose} />
    </div>
  );
};

export default ViewMediaModalV2;
