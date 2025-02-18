import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Kokan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <SpeedInsights/>
        <ClerkProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ProgressBarProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster position="bottom-center" />
            </ProgressBarProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
