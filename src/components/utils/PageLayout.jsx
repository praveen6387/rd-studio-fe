import Header from "./Header";
import Footer from "./Footer";

export default function PageLayout({ children, footer = true, sidebar = false, header = true }) {
  return (
    <div className="min-h-screen flex flex-col text-black">
      {header && <Header />}
      <main className={`flex-1 ${sidebar ? "pt-0" : ""}`}>{children}</main>
      {footer && <Footer />}
    </div>
  );
}
