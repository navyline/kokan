"use client";

import { useState } from "react";
import { uploadVerification } from "@/app/actions/uploadVerification";
import { useUser } from "@clerk/nextjs";

export default function VerificationUpload() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setStatus("Uploading...");
      await uploadVerification(user.id, file);
      setStatus("Uploaded successfully! Pending approval.");
    } catch (error) {
      setStatus(`Upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Verify Your Identity</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full rounded-md"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        Upload
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
