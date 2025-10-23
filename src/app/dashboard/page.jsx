import DashboardIndex from '@/components/dashboard';
import ProtectedRoute from '@/components/utils/ProtectedRoute';

export default function page() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardIndex />
    </ProtectedRoute>
  );
} 