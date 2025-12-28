import React from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import ImageView from "./_builder/ImageView";
import VideoView from "./_builder/VideoView";
import FlipbookView from "./_builder/FlipbookView";
import { X } from "lucide-react";

const MediaViewModal = ({ data, open, onOpenChange }) => {
  if (!data) return null;

  const { media_type, media_title, media_description, media_library_items } = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/60 backdrop-blur-sm border-none w-screen h-screen max-w-none flex items-center justify-center">
        <DialogClose className="absolute right-4 top-4 z-50">
          <X className="h-4 w-4 text-white" />
        </DialogClose>

        {media_type === 0 ? (
          <ImageView
            media_title={media_title}
            media_description={media_description}
            media_library_item={media_library_items?.[0]}
          />
        ) : media_type === 1 ? (
          <VideoView
            media_title={media_title}
            media_description={media_description}
            media_library_item={media_library_items?.[0]}
          />
        ) : (
          <FlipbookView
            media_title={media_title}
            media_description={media_description}
            media_library_items={media_library_items}
            data={data}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewModal;
