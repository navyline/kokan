import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const profile = await prisma.profile.upsert({
    where: { clerkId: userId },
    update: {
      firstName: body.firstName,
      lastName: body.lastName,
      profileImage: body.profileImage,
    },
    create: {
      clerkId: userId,
      firstName: body.firstName,
      lastName: body.lastName,
      profileImage: body.profileImage,
    },
  });

  return NextResponse.json(profile);
}
