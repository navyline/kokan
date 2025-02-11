"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPageClient() {
  const { user } = useUser();
  const router = useRouter();

  // หากผู้ใช้ล็อกอินแล้ว ให้เปลี่ยนหน้าอัตโนมัติไป /home
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 text-white overflow-hidden">
      {/* ส่วน Navigation Bar */}
      <nav className="bg-transparent flex items-center justify-between py-4 px-6 z-10 relative">
        <div className="text-2xl font-bold tracking-wide">
          แลกเปลี่ยนสินค้า
        </div>
        <div className="space-x-2">
          <button
            onClick={() => router.push("/sign-in")}
            className="px-5 py-2 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-100 transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-5 py-2 bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          >
            สมัครสมาชิก
          </button>
        </div>
      </nav>

      {/* ส่วน Hero Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            ยินดีต้อนรับสู่<br />
            <span className="text-white">ระบบแลกเปลี่ยนสินค้าออนไลน์</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            เว็บไซต์ที่จะช่วยให้คุณสามารถแลกเปลี่ยนสินค้าได้อย่าง
            <span className="font-semibold text-white">
              สะดวก รวดเร็ว และปลอดภัย
            </span>
            สามารถโพสต์ขาย หรือแลกเปลี่ยนสินค้าของคุณได้ง่าย ๆ
            พร้อมระบบแชทและการแจ้งเตือนในตัว
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/sign-up")}
              className="px-8 py-3 bg-pink-500 rounded-md font-semibold hover:bg-pink-600 transition duration-200"
            >
              เริ่มต้นเลย
            </button>
          </div>
        </div>
      </div>

      {/* ส่วน Feature Highlights */}
      <div className="bg-white/20 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">
          ฟีเจอร์เด็ดของเรา
        </h2>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 max-w-6xl mx-auto">
          <div className="flex-1 p-6 bg-white/10 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">ระบบโพสต์สินค้า</h3>
            <p className="text-sm text-white/90">
              ให้คุณสร้าง แก้ไข หรือลบโพสต์ได้ทันที
              อัปโหลดรูปสินค้าและกำหนดจุดนัดพบผ่านแผนที่ได้ง่าย ๆ
            </p>
          </div>
          <div className="flex-1 p-6 bg-white/10 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">ระบบคอมเมนต์ & ถูกใจ</h3>
            <p className="text-sm text-white/90">
              แสดงความคิดเห็นต่อโพสต์ และกดถูกใจโพสต์
              พร้อมทั้งดูจำนวนผู้กดถูกใจได้แบบเรียลไทม์
            </p>
          </div>
          <div className="flex-1 p-6 bg-white/10 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">ระบบแชทส่วนตัว</h3>
            <p className="text-sm text-white/90">
              พูดคุยกับผู้ขายหรือผู้สนใจสินค้าในช่องทางส่วนตัวได้ทันที
              ไม่ต้องออกจากระบบ
            </p>
          </div>
        </div>
      </div>

      {/* ส่วน Footer */}
      <footer className="bg-white/20 backdrop-blur-md py-4 px-6 text-center text-sm text-white/80 mt-auto">
        © {new Date().getFullYear()} ระบบแลกเปลี่ยนสินค้า | สร้างสรรค์ด้วย Next.js & Clerk
      </footer>
    </div>
  );
}
