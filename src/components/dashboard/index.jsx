"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { useUser } from "@/contexts/UserContext";

const DashboardIndex = () => {
  const { user } = useUser();
  return (
    <DashboardPageLayout title="" description="">
      {/* Stats Cards */}
      <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center text-center">
        <h2 className="text-7xl  font-extrabold animate-bounce  text-gray-700 cursor-default select-none tracking-wide drop-shadow-lg space-y-6">
          <div>Welcome</div>
          <div>{user?.name || "User"}</div>
        </h2>
      </div>
    </DashboardPageLayout>
  );
};

export default DashboardIndex;
