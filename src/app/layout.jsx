import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";
import RouteLoadingBar from "@/components/ui/route-loading-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RD Photo - Professional Photography Services",
  description:
    "Professional photography services for weddings, portraits, events, and more. Capture life's beautiful moments with RD Photo.",
  keywords: "photography, wedding photography, portrait photography, event photography, professional photographer",
  authors: [{ name: "RD Photo" }],
  creator: "RD Photo",
  openGraph: {
    title: "RD Photo - Professional Photography Services",
    description: "Professional photography services for weddings, portraits, events, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RD Photo - Professional Photography Services",
    description: "Professional photography services for weddings, portraits, events, and more.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased !bg-white`}>
        <NuqsAdapter>
          <UserProvider>
            <SidebarProvider>
              <RouteLoadingBar />
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 4000,
                    style: {
                      background: "#10b981",
                      color: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: "#ef4444",
                      color: "#fff",
                    },
                  },
                }}
              />
            </SidebarProvider>
          </UserProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
