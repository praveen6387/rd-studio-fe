import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageView from "./_builder/ImageView";
import VideoView from "./_builder/VideoView";
import FlipbookView from "./_builder/FlipbookView";

const MediaViewModal = ({ data, open, onOpenChange }) => {
  if (!data) return null;

  const { media_type, media_title, media_description, media_library_items } = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogContent already includes a top-right close (X) button */}
      <DialogContent className="bg-black/60 backdrop-blur-sm border-none w-screen h-screen max-w-none top-0 left-0 translate-x-0 translate-y-0 rounded-none sm:rounded-none">
        <div className="w-full h-full flex flex-col overflow-hidden">
          {/* <DialogHeader className="px-6 pt-6 pb-2 text-center">
            <DialogTitle>{media_title}</DialogTitle>
            {media_description && <DialogDescription className="mt-1">{media_description}</DialogDescription>}
          </DialogHeader> */}

          <div className="px-6 pb-6 pt-2 flex-1 flex items-center justify-center">
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
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewModal;
