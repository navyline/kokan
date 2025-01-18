// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
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
        <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
