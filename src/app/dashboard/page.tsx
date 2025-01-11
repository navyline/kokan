// app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  // ดึง userId จาก token
  const { userId } = await auth();
  if (!userId) {
    return <div>Not logged in</div>;
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน (Clerk's Backend API User object)
  const user = await currentUser();
  
  return <div>Welcome, {user?.firstName}!</div>;
}
