import PageLayout from "@/components/utils/PageLayout";
import Sidenav from "@/components/utils/SideNav";

export default function DashboardLayout({ children }) {
  return (
    <PageLayout header={false} footer={false} sidebar={true}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidenav />
        <main
          className="flex-1 transition-all duration-300 ease-in-out relative bg-white"
          style={{
            backgroundImage: "url('/images/png/bg4.jpg')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="relative z-10 px-2">{children}</div>
        </main>
      </div>
    </PageLayout>
  );
}
