// page.tsx (Server Component)
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchPostForEdit } from "./actions";
import EditPostClient from "./EditPostClient";

interface EditPostPageProps {
  params: Promise<{ id: string }>; 
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // ประกาศว่า params เป็น Promise ของ object ที่มี id เป็น string
  // เพื่อให้ TypeScript เข้าใจว่าเราต้อง await
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // ต้อง await params ก่อน destructure
  const { id } = await params;

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // ตรวจสอบสิทธิ์
  const post = await fetchPostForEdit(id, user.id);
  if (!post) {
    notFound();
  }

  return <EditPostClient post={post} />;
}
