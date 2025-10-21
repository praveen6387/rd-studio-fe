import {cookies} from "next/headers"
import MediaIndex from "@/components/dashboard/media";
import { getMediaLibrary } from "@/lib/api/server/media/urls";

const MediaPage = async () => {
  const token = cookies().get("dashboard_access_token")
  const mediaLibrary = await getMediaLibrary(token.value);

  return (
    <div>
      <MediaIndex mediaLibrary={mediaLibrary} />
    </div>
  );
};

export default MediaPage;
