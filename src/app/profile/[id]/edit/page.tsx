import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getProfileById } from "../actions";
import { updateProfileAction } from "./actions";

type EditProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { id } = await params;

  const user = await currentUser();
  if (!user) {
    notFound();
  }

  const profile = await getProfileById(id);
  if (!profile) {
    notFound();
  }

  if (profile.clerkId !== user.id) {
    notFound();
  }

  async function handleUpdateProfile(formData: FormData) {
    "use server";

    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const userName = formData.get("userName")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";

    try {
      await updateProfileAction(id, { firstName, lastName, userName, bio });

      revalidatePath(`/profile/${id}`);
      redirect(`/profile/${id}`);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ แก้ไขโปรไฟล์
        </h1>

        {/* ฟอร์มแก้ไขโปรไฟล์ */}
        <form action={handleUpdateProfile} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block font-medium text-gray-700 mb-1">
              ชื่อจริง
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={profile.firstName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block font-medium text-gray-700 mb-1">
              นามสกุล
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={profile.lastName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="userName" className="block font-medium text-gray-700 mb-1">
              ชื่อผู้ใช้ (@username)
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              defaultValue={profile.userName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block font-medium text-gray-700 mb-1">
              แนะนำตัว (Bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio || ""}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* ปุ่ม Save และ Cancel */}
          <div className="flex justify-between items-center">
            <a
              href={`/profile/${id}`}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              ❌ ยกเลิก
            </a>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              ✅ บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}