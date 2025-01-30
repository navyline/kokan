"use client";

import { approveVerification, rejectVerification } from "@/app/actions/adminActions";

interface Verification {
  id: string;
  documentUrl: string;
}

export default function VerificationManagement({ verifications }: { verifications: Verification[] }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Verification Requests</h2>
      {verifications.length === 0 ? (
        <p className="text-gray-600">No pending verifications.</p>
      ) : (
        verifications.map((verification) => (
          <div key={verification.id} className="border p-4 rounded-md mb-2 flex justify-between">
            <a href={verification.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Document</a>
            <div className="flex gap-2">
              <button onClick={() => approveVerification(verification.id)} className="text-green-500">Approve</button>
              <button onClick={() => rejectVerification(verification.id)} className="text-red-500">Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
