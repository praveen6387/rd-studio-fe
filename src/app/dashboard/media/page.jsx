import { cookies } from "next/headers";
import MediaIndex from "@/components/dashboard/media";
import { getMediaLibrary } from "@/lib/api/server/media/urls";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

const MediaPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const mediaLibrary = await getMediaLibrary(token?.value);
  console.log(mediaLibrary);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div>
        <MediaIndex mediaLibrary={mediaLibrary} />
      </div>
    </ProtectedRoute>
  );
};

export default MediaPage;
