import Operation2Index from "@/components/dashboard/operations2";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

const Operations2Page = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Operation2Index />
    </ProtectedRoute>
  );
};

export default Operations2Page;
