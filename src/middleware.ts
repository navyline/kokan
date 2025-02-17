import { clerkMiddleware } from "@clerk/nextjs/server";
import {  NextRequest, NextFetchEvent } from "next/server";

export default function customMiddleware(req: NextRequest, evt: NextFetchEvent) {
  // เรียกใช้งาน middleware มาตรฐานของ Clerk
  return clerkMiddleware()(req, evt);
}

export const config = {
  matcher: [
    // ระบุเส้นทางที่ต้องการให้ middleware นี้ทำงาน
    // ข้าม (ignore) ไฟล์ static, ไฟล์ระบบของ Next.js และไฟล์สกุลต่างๆ ที่กำหนด
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
