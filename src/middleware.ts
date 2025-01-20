import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

export default function customMiddleware(req: NextRequest, evt: NextFetchEvent) {
  const response = clerkMiddleware()(req, evt); // ส่ง req และ event

  const url = req.nextUrl;
  const userId = req.headers.get("clerk-user-id"); // ดึง userId จาก header

  // ถ้าผู้ใช้ล็อกอินและอยู่หน้า root "/"
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url)); // เปลี่ยนไปหน้า /home
  }

  return response; // ส่ง response กลับ
}

export const config = {
  matcher: [
    // ข้าม static files, Next.js internals และ process API routes เสมอ
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
