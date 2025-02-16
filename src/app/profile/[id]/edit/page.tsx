import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getProfileById } from "./actions";
import EditProfileClient from "./EditProfileClient";

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

  return <EditProfileClient profile={{ ...profile, bio: profile.bio ?? undefined }} />;
}
