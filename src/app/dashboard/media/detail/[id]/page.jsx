import ProtectedRoute from "@/components/utils/ProtectedRoute";
import DetailMediaIndex from "@/components/dashboard/media/detail";
import { getMediaLibraryById } from "@/lib/api/server/media/urls";
import { cookies } from "next/headers";

const DetailMediaPage = async ({ params }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const media = await getMediaLibraryById(id, token?.value);
  console.log(media);
  return (
    <ProtectedRoute requireAdmin={true}>
      <DetailMediaIndex media={media} />
    </ProtectedRoute>
  );
};

export default DetailMediaPage;
