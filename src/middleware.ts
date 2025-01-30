import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

export default function customMiddleware(req: NextRequest, evt: NextFetchEvent) {
  // เรียกใช้งาน middleware มาตรฐานของ Clerk
  const response = clerkMiddleware()(req, evt);

  // ดึงข้อมูล userId จาก header ที่ Clerk ใส่ไว้ (ถ้ามี)
  const url = req.nextUrl;
  const userId = req.headers.get("clerk-user-id");

  // ถ้า userId มีค่า และกำลังอยู่ในเส้นทาง "/" ให้ redirect ไป "/home"
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ถ้าไม่เข้าเงื่อนไขอื่น ให้คืนค่าตามปกติ (response ที่ได้จาก clerkMiddleware)
  return response;
}

export const config = {
  matcher: [
    // ระบุเส้นทางที่ต้องการให้ middleware นี้ทำงาน
    // ข้าม (ignore) ไฟล์ static, ไฟล์ระบบของ Next.js และไฟล์สกุลต่างๆ ที่กำหนด
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};