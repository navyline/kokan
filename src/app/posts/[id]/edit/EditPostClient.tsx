"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePostAction } from "./actions";

// Interface สำหรับ PostType (ปรับตาม Model ของคุณ)
interface PostType {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  images: string[]; // Prisma เก็บเป็น String[]
}

// Props รับ post จาก Server Component
export default function EditPostClient({ post }: { post: PostType }) {
  const router = useRouter();

  const [name, setName] = useState(post.name);
  const [description, setDescription] = useState(post.description);
  const [price, setPrice] = useState(post.price.toString());
  const [condition, setCondition] = useState(post.condition);
  // แปลง array ของรูปภาพเป็น comma separated string
  const [images, setImages] = useState(post.images.join(","));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันจัดการ submit
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    try {
      await updatePostAction(formData);
      router.push(`/posts/${post.id}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("เกิดข้อผิดพลาดในการแก้ไขโพสต์");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">แก้ไขโพสต์</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ซ่อน postId */}
        <input type="hidden" name="postId" value={post.id} />

        <div>
          <label className="block font-semibold mb-1">ชื่อโพสต์</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อสินค้า หรือสิ่งที่ต้องการโพสต์"
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">รายละเอียด</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="รายละเอียดสินค้า"
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">ราคา (บาท)</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="ตัวอย่าง: 1500"
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">สภาพสินค้า</label>
          <select
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3"
            required
          >
            <option value="NEW">ใหม่</option>
            <option value="USED">มือสอง</option>
            <option value="LIKE_NEW">เหมือนใหม่</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">รูปภาพ (คั่นด้วยเครื่องหมายจุลภาค)</label>
          <input
            type="text"
            name="images"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="https://..., https://..."
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3"
          />
          <p className="text-sm text-gray-500 mt-1">
            ใส่ลิงก์รูปภาพหลายรูปได้ โดยคั่นด้วยเครื่องหมายจุลภาค
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/posts/${post.id}`)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </section>
  );
}
