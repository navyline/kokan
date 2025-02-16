"use client";

import React, {
  useState,
  useCallback,
  useTransition,
  memo,
  FormEvent,
  ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createPostAction } from "./actions";

const MapLandmark = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

const categories = [
  { value: "e20dcccd-d509-4d14-90a6-03f7f366ec56", label: "Home Appliances" },
  { value: "4c87dec0-3e31-4947-9701-4f4e58b05c41", label: "Tools" },
  { value: "145e254c-c39d-45a3-9d35-72b0ccae20a9", label: "Electronics" },
  { value: "42e71209-ad6a-494d-b0c4-e2cbc2223fcb", label: "Furniture" },
  { value: "765ed765-ebe4-41a3-9032-06e8928fcfb3", label: "Books" },
  { value: "e29e786a-8fe7-41d5-9524-44010a1eeb5b", label: "Toys" },
  { value: "eec05cbe-baf2-4fe5-bbc2-6694d42e66a1", label: "Clothing" },
  { value: "6a8c3948-512b-407c-9497-cb6b0825b60f", label: "Sports Equipment" },
  { value: "0a2760d2-15d3-4f44-9118-3495b9d8ef07", label: "Other" },
];

const conditions = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
];

const CreatePostRaw = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  // Handler: อัปโหลดรูปภาพ
  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    },
    []
  );

  // Handler: ลบรูปภาพที่เลือก
  const handleRemoveImage = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handler: Submit form
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.currentTarget);
      files.forEach((file) => formData.append("images", file));

      startTransition(async () => {
        try {
          const postUrl = await createPostAction(formData);
          router.push(postUrl);
        } catch (err) {
          console.error("❌ Failed to create post:", err);
          setError("เกิดข้อผิดพลาดในการสร้างโพสต์");
        } finally {
          setLoading(false);
        }
      });
    },
    [files, router]
  );

  return (
    <section className="relative p-4 sm:p-8 min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-purple-50 to-purple-100">
      {/* Overlay Loading Animation */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Spinner SVG */}
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-gray-200 animate-spin fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7237 75.2124 7.41289C69.5422 4.1021 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          สร้างโพสต์ของคุณ
        </h1>
        <p className="text-center text-gray-600 mb-8">
          ระบุรายละเอียดสินค้าและข้อมูลที่จำเป็นเพื่อให้ผู้อื่นสามารถเข้ามาดูและติดต่อคุณได้ง่าย
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              name="name"
              placeholder="เช่น โทรศัพท์มือถือ, ตู้เย็น..."
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
              required
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              หมวดหมู่
            </label>
            <select
              name="category"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
              required
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* สภาพสินค้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              สภาพสินค้า
            </label>
            <select
              name="condition"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
              required
            >
              <option value="">-- เลือกสภาพสินค้า --</option>
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* รายละเอียดสินค้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รายละเอียด
            </label>
            <textarea
              name="description"
              placeholder="เช่น อธิบายลักษณะ, ยี่ห้อ, รุ่น, ปีที่ซื้อ..."
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
              rows={5}
              required
            />
          </div>

          {/* ราคา & จังหวัด */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ราคา (บาท)
              </label>
              <input
                type="number"
                name="price"
                placeholder="ตัวอย่าง: 1500"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                จังหวัด
              </label>
              <input
                type="text"
                name="province"
                placeholder="เช่น กรุงเทพฯ, เชียงใหม่..."
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-purple-400 focus:border-purple-400"
                required
              />
            </div>
          </div>

          {/* อัปโหลดภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปสินค้า
            </label>
            <div
              className="border-2 border-dashed border-purple-400 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-50 transition relative"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <p className="text-gray-500 pointer-events-none">
                ลากและวางรูปภาพที่นี่ <br />
                หรือ{" "}
                <span className="text-purple-500 font-semibold underline">
                  คลิกเพื่อเลือกไฟล์
                </span>
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* แสดงภาพตัวอย่าง */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={src}
                      alt={`ภาพตัวอย่าง ${index + 1}`}
                      className="object-cover rounded-lg border"
                      width={80}
                      height={80}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map สำหรับระบุ lat/lng หรือจุดนัดหมาย */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ระบุตำแหน่งหรือจุดนัดพบ (ถ้ามี)
            </label>
            <div className="rounded-lg overflow-hidden border border-gray-300">
              <MapLandmark />
            </div>
          </div>

          {/* ปุ่ม Submit */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center text-white font-semibold py-3 rounded-lg transition shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            }`}
            disabled={loading || isPending}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-200 animate-spin fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7237 75.2124 7.41289C69.5422 4.1021 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                <span>กำลังส่ง...</span>
              </div>
            ) : (
              "สร้างโพสต์"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default memo(CreatePostRaw);
