import ProtectedRoute from "@/components/utils/ProtectedRoute";
import UsersIndex from "@/components/dashboard/users";
import { getUsers } from "@/lib/api/server/user/urls";
import { cookies } from "next/headers";

const UsersPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const users = await getUsers(token?.value);
  return (
    <ProtectedRoute requireAdmin={true}>
      <UsersIndex users={users} />
    </ProtectedRoute>
  );
};

export default UsersPage;
