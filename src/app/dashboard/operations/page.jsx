import OperationsIndex from "@/components/dashboard/operations";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

const OperationsPage = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <OperationsIndex />
    </ProtectedRoute>
  );
};

export default OperationsPage;
