import BillingIndex from "@/components/dashboard/billing";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { getCurrentUser } from "@/lib/api/server/user/urls";
import { cookies } from "next/headers";

const BillingPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const current_user = await getCurrentUser(token?.value);
  return (
    <ProtectedRoute requireAdmin={true}>
      <BillingIndex current_user={current_user} />
    </ProtectedRoute>
  );
};

export default BillingPage;
