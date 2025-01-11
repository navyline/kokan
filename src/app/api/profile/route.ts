import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1) auth() ต้องใส่ await
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) อ่าน Body
  const body = await req.json();

  // 3) หา Profile เดิม หรือสร้างใหม่
  let profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        // ต้องแม่นยำตรงกับ Prisma schema
        clerkId: userId,
        firstName: body.firstName ?? "",
        lastName: body.lastName ?? "",
        userName: body.userName ?? "",
        email: body.email ?? "",
        profileImage: body.profileImage ?? "",
      },
    });
  } else {
    // Update โปรไฟล์เดิม
    profile = await prisma.profile.update({
      where: { clerkId: userId },
      data: {
        firstName: body.firstName ?? profile.firstName,
        lastName: body.lastName ?? profile.lastName,
        userName: body.userName ?? profile.userName,
        profileImage: body.profileImage ?? profile.profileImage,
      },
    });
  }

  return NextResponse.json({ profile });
}
