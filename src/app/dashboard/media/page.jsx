import MediaIndex from "@/components/dashboard/media";
import { getMediaLibrary } from "@/lib/api/server/media/urls";

const MediaPage = async () => {
  const mediaLibrary = await getMediaLibrary();

  return (
    <div>
      <MediaIndex mediaLibrary={mediaLibrary} />
    </div>
  );
};

export default MediaPage;
