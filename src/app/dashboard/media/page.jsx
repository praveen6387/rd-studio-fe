import MediaIndex from "@/components/dashboard/media";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { getCurrentUser } from "@/lib/api/server/user/urls";
import { getMediaLibrary } from "@/lib/api/server/media/urls";
import { cookies } from "next/headers";

const MediaListingPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const current_user = await getCurrentUser(token);
  const mediaLibrary = await getMediaLibrary(token);

  return (
    <ProtectedRoute requireAdmin={true}>
      <MediaIndex mediaLibrary={mediaLibrary} />
    </ProtectedRoute>
  );
};

export default MediaListingPage;
