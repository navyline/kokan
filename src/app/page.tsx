"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPageClient() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  // เมื่อโหลดข้อมูลผู้ใช้เสร็จแล้ว และพบว่าผู้ใช้ล็อกอินอยู่ ให้ redirect ไป /home
  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/home");
    }
  }, [isLoaded, user, router]);

  // หากข้อมูลผู้ใช้ยังไม่โหลดหรือมีผู้ใช้อยู่แล้ว ไม่ต้องแสดงหน้า Landing Page
  if (!isLoaded || user) {
    return null;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 text-white overflow-hidden">
      {/* ส่วน Hero Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            ยินดีต้อนรับสู่<br />
            <span className="text-white">ระบบแลกเปลี่ยนสินค้าออนไลน์</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            เว็บไซต์ที่จะช่วยให้คุณสามารถแลกเปลี่ยนสินค้าได้อย่าง{" "}
            <span className="font-semibold text-white">
              สะดวก รวดเร็ว และปลอดภัย
            </span>{" "}
            สามารถโพสต์ขาย หรือแลกเปลี่ยนสินค้าของคุณได้ง่าย ๆ
            พร้อมระบบแชทและการแจ้งเตือนในตัว
          </p>
          <div className="pb-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
