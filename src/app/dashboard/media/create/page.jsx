import CreateMediaIndex from "@/components/dashboard/media/create";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

const CreateMediaPage = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <CreateMediaIndex />
    </ProtectedRoute>
  );
};

export default CreateMediaPage;
