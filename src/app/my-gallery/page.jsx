// Test navigation - try Cmd+Click on MyGalleryIndex
import MyGalleryIndex from "@/components/my-gallery";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

export default function MyGallery() {
  return (
    <ProtectedRoute requireAdmin={false}>
      <MyGalleryIndex />
    </ProtectedRoute>
  );
}
