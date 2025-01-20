import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { Suspense } from "react";
import "./globals.css";

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
        <ClerkProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ProgressBarProvider>
              <Navbar />
              {children}
            </ProgressBarProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
