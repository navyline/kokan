import { createProfileAction } from "./actions";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CreateProfile = async () => {
  const user = await currentUser();
  if (user?.privateMetadata.hasProfile) redirect("/");

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Profile
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please fill in the details below to create your profile.
        </p>

        <FormContainer action={createProfileAction}>
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Enter your first name"
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
            />
          </div>
          <div className="mt-4">
            <FormInput
              name="userName"
              label="Username"
              type="text"
              placeholder="Choose a username"
            />
          </div>
          <div className="mt-6">
            <SubmitButton
              text="Create Profile"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            />
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateProfile;
