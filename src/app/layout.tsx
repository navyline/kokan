import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kokan",
  description: "Welcome to my Next.js project!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* เช่น ใส่ Navbar หรือ Providers (context, redux ฯลฯ) ตรงนี้ */}
        {children}
      </body>
    </html>
  );
}
