import React from "react";
import MediaViewModal from "@/components/utils/mediaViewModal";

const ViewMediaModalV2 = ({ isOpen, onClose, mediaData, current_user }) => {
  if (!mediaData || !isOpen) return null;

  return (
    <div>
      <MediaViewModal data={mediaData} open={isOpen} onOpenChange={onClose} current_user={current_user} />
    </div>
  );
};

export default ViewMediaModalV2;
