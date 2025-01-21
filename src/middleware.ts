import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

export default function customMiddleware(req: NextRequest, evt: NextFetchEvent) {
  const response = clerkMiddleware()(req, evt); 

  const url = req.nextUrl;
  const userId = req.headers.get("clerk-user-id");

  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    // ข้าม static files, Next.js internals และ process API routes เสมอ
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
