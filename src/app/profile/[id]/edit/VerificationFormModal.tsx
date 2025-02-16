"use client";

import React, { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// ตัวอย่าง import ไอคอนจาก lucide-react
import { X, Phone, MapPin, ImagePlus } from "lucide-react";

import { submitVerificationRequestAction } from "./actions"; // เรียก Server Action ตามจริง

interface VerificationFormModalProps {
  profileId: string;
  onClose: () => void;
}

export default function VerificationFormModal({
  profileId,
  onClose,
}: VerificationFormModalProps) {
  const router = useRouter();

  // State ของฟอร์ม
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // จัดการไฟล์รูปบัตรประชาชน
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentImage(e.target.files[0]);
    }
  };

  // เมื่อกด Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profileId", profileId);
      formData.append("phone", phone);
      formData.append("address", address);
      if (documentImage) {
        formData.append("documentImage", documentImage);
      }

      // เรียก Server Action
      await submitVerificationRequestAction(formData);

      toast.success("ส่งคำขอยืนยันตัวตนเรียบร้อย!");
      onClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("เกิดข้อผิดพลาดในการยืนยันตัวตน");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* กล่อง Modal */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ส่วนหัว Modal */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            ยืนยันตัวตน
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            กรุณากรอกข้อมูลส่วนตัวและอัปโหลดรูปบัตรประชาชน
          </p>
        </div>

        {/* เนื้อหา Modal (ฟอร์ม) */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* เบอร์โทรศัพท์ */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-1">
              <Phone className="h-4 w-4 text-gray-600" />
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ใส่เบอร์โทร"
              required
            />
          </div>

          {/* ที่อยู่ */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              ที่อยู่
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ใส่ที่อยู่ปัจจุบัน"
              required
            />
          </div>

          {/* อัปโหลดบัตร */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-1">
              <ImagePlus className="h-4 w-4 text-gray-600" />
              อัปโหลดภาพบัตรประชาชน
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         cursor-pointer"
            />
          </div>

          {/* ปุ่มกดยืนยันตัวตน */}
          <div className="text-right mt-5">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition font-medium"
            >
              {loading ? "กำลังส่ง..." : "ยืนยันตัวตน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
