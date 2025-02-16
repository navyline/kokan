"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { submitVerificationRequest, getVerificationStatus } from "@/app/actions/verificationActions";

export default function VerificationForm() {
  const [documentUrl, setDocumentUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const verStatus = await getVerificationStatus();
      setStatus(verStatus);
    }
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("documentUrl", documentUrl);
      await submitVerificationRequest(formData);
      toast.success("ส่งคำขอยืนยันตัวตนเรียบร้อยแล้ว!");
      const verStatus = await getVerificationStatus();
      setStatus(verStatus);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการส่งคำขอ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการส่งคำขอ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">ยืนยันตัวตน</h2>
      {status === "APPROVED" ? (
        <div className="flex items-center text-green-600">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>การยืนยันตัวตนได้รับการอนุมัติแล้ว</span>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="documentUrl" className="block mb-2 font-medium">
                URL เอกสารแสดงตัวตน
              </label>
              <input
                type="text"
                id="documentUrl"
                name="documentUrl"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "กำลังส่ง..." : "ส่งคำขอยืนยันตัวตน"}
            </button>
          </form>
          {status && status !== "APPROVED" && (
            <p className="text-sm text-gray-600 mt-2">
              สถานะการยืนยัน: {status === "PENDING" ? "รอดำเนินการ" : "ถูกปฏิเสธ"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
