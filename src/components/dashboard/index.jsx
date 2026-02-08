"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const DashboardIndex = () => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <DashboardPageLayout title="" description="">
      {/* Stats Cards */}
      <div className="w-full h-[calc(30vh-100px)] flex items-center justify-center text-center">
        <h2 className="text-4xl font-extrabold animate-bounce text-gray-700 tracking-wide drop-shadow-lg space-y-6">
          <div>Welcome</div>
          <div>{user?.name || "User"}</div>
        </h2>
      </div>

      {/* plan */}
      <div className="max-w-5xl mx-auto my-8 px-4">
        <div className="mb-4 text-center">
          <p className="text-xl text-gray-600 mt-1">Choose a plan to recharge credits and unlock features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Studio Plan */}
          <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-linear-to-b from-white to-gray-50 hover:shadow-2xl transition-shadow">
            <div className="flex items-start gap-4" onClick={() => router.push("/dashboard/billing?is_open=true")}>
              {/* <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center ring-1 ring-indigo-100">
                <div className="text-indigo-600 font-bold">B</div>
              </div> */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Basic Studio Plan</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Simple and fast — 1 month</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-indigo-600">₹149</div>
                    <div className="text-xs text-gray-500">1 month • 10 credits</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-medium text-sm text-gray-700">Features</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Simple way to create flipbook</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Upload cover page (front & back)</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Rearrange images easily</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Generate and share QR code quickly</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Instagram & WhatsApp link on Flipbook View for marketing</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> One Click to Share on WhatsApp</li>
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">10 credits will be added on successful payment</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">Recommended</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Version */}
          <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-linear-to-b from-white to-gray-50 hover:shadow-2xl transition-shadow border-2 border-indigo-50" onClick={() => router.push("/dashboard/billing?is_open=true")}>
            <div className="flex items-start gap-4">
              {/* <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold ring-1 ring-indigo-200">
                L
              </div> */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Lab Version</h4>
                    <p className="text-sm text-gray-500 mt-0.5">For studios — 3 months</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-indigo-600">₹399</div>
                    <div className="text-xs text-gray-500">3 months • 20 credits</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-medium text-sm text-gray-700">Includes Basic Studio features plus</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Add studio name</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Instagram link for the studio</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> WhatsApp contact name for the studio</li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> All features from Basic Studio Plan</li>
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">20 credits will be added on successful payment</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full">Most Popular</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
};

export default DashboardIndex;
