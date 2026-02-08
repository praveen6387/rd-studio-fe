import CreateMediaIndex from "@/components/dashboard/media/create";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { getCurrentUser } from "@/lib/api/server/user/urls";
import { cookies } from "next/headers";

const CreateMediaPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const current_user = await getCurrentUser(token?.value);
  console.log(current_user)
  return (
    <ProtectedRoute requireAdmin={true}>
      <CreateMediaIndex current_user={current_user.user} />
    </ProtectedRoute>
  );
};

export default CreateMediaPage;
