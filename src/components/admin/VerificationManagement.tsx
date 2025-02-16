"use client";

import React from "react";
import toast from "react-hot-toast";
import { approveVerification, rejectVerification } from "@/app/actions/adminActions";

interface Verification {
  id: string;
  userId: string;
  documentUrl: string;
  phone?: string | null;
  address?: string | null;
}

interface VerificationManagementProps {
  verifications: Verification[];
  setVerifications: React.Dispatch<React.SetStateAction<Verification[]>>;
}

export default function VerificationManagement({
  verifications,
  setVerifications,
}: VerificationManagementProps) {
  const handleApprove = async (verificationId: string) => {
    try {
      await approveVerification(verificationId);
      toast.success("อนุมัติคำขอสำเร็จ");
      // ลบ item ออกจาก state หรือเปลี่ยน status
      setVerifications((prev) => prev.filter((v) => v.id !== verificationId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการอนุมัติ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการอนุมัติ");
      }
    }
  };

  const handleReject = async (verificationId: string) => {
    try {
      await rejectVerification(verificationId);
      toast.success("ปฏิเสธคำขอสำเร็จ");
      setVerifications((prev) => prev.filter((v) => v.id !== verificationId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการปฏิเสธ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการปฏิเสธ");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">
        คำขอยืนยันตัวตน ({verifications.length})
      </h2>
      <div className="border-t pt-3 space-y-3 max-h-80 overflow-auto">
        {verifications.length === 0 ? (
          <p className="text-gray-500">ไม่มีคำขอใหม่</p>
        ) : (
          verifications.map((v) => (
            <div
              key={v.id}
              className="border border-gray-200 rounded p-3 hover:shadow-sm transition"
            >
              <p className="font-semibold text-gray-800">
                Verification ID: {v.id}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                เบอร์โทร: {v.phone || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                ที่อยู่: {v.address || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {/* Document Image / URL */}
                <a
                  href={v.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ดูเอกสารบัตรประชาชน
                </a>
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleApprove(v.id)}
                  className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded"
                >
                  อนุมัติ
                </button>
                <button
                  onClick={() => handleReject(v.id)}
                  className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded"
                >
                  ปฏิเสธ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
