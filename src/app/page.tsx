"use client";

import React, { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";

/** นำเข้าไอคอนจาก Heroicons (เวอร์ชัน Outline) */
import {
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function LandingPageClient() {
  const { isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-black text-white overflow-hidden">
      {/* ส่วน Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10">
        {/* ข้อความและปุ่ม */}
        <div className="max-w-3xl text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-2xl">
            ยินดีต้อนรับสู่
            <br />
            <span className="text-pink-400">ระบบแลกเปลี่ยนสินค้าออนไลน์</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
            เว็บไซต์ที่จะช่วยให้คุณสามารถแลกเปลี่ยนสินค้าได้อย่าง{" "}
            <span className="font-semibold text-white">
              สะดวก รวดเร็ว และปลอดภัย
            </span>{" "}
            สามารถโพสต์ขาย หรือแลกเปลี่ยนสินค้าของคุณได้ง่าย ๆ
            พร้อมระบบแชทและการแจ้งเตือนในตัว
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {}}
              className="px-8 py-3 bg-pink-500 rounded-md font-semibold hover:bg-pink-600 transition duration-200 shadow-lg"
            >
              เริ่มต้นเลย
            </button>
          </div>
        </div>

        {/* แถบไอคอน (Marquee) แบบต่อเนื่อง */}
        <div className="relative w-full h-32 overflow-hidden mb-10">
          <motion.div
            className="flex w-[200%] h-full absolute"
            // เริ่มต้น x:0 และเลื่อนไป x:-50% เพื่อให้เกิดการเลื่อนต่อเนื่อง
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 20, // ปรับความเร็วเลื่อนตามต้องการ (วินาที)
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* ชุดที่ 1 */}
            <div className="flex items-center gap-16 w-1/2 justify-evenly">
              <TechIcons />
            </div>
            {/* ชุดที่ 2 (ซ้ำต่อกัน) */}
            <div className="flex items-center gap-16 w-1/2 justify-evenly">
              <TechIcons />
            </div>
          </motion.div>
        </div>
      </div>

      {/* บริการของเรา (Services Section) */}
      <div className="bg-white/5 py-12 px-4 sm:px-6 lg:px-8 rounded-md shadow-md">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 drop-shadow-lg">
          บริการของเรา
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <ServiceCard
            Icon={ShoppingBagIcon}
            title="ใช้งานง่าย"
            description="ออกแบบมาให้ใช้งานง่าย ใคร ๆ ก็แลกเปลี่ยนสินค้าได้สบาย"
          />
          <ServiceCard
            Icon={ChatBubbleLeftRightIcon}
            title="โพสต์สินค้าเร็ว"
            description="เพียงไม่กี่คลิก ก็สร้างโพสต์พร้อมรูปภาพได้ทันที"
          />
          <ServiceCard
            Icon={BellAlertIcon}
            title="แจ้งเตือนเรียลไทม์"
            description="ไม่พลาดทุกการติดต่อ ข้อเสนอใหม่ ๆ ส่งตรงถึงคุณทันที"
          />
          <ServiceCard
            Icon={CloudArrowUpIcon}
            title="ระบบแชทในตัว"
            description="พูดคุย ตกลงแลกเปลี่ยนได้อย่างปลอดภัยในแพลตฟอร์ม"
          />
          <ServiceCard
            Icon={DevicePhoneMobileIcon}
            title="รองรับหลายช่องทาง"
            description="ใช้งานได้ทั้งบนมือถือและคอมพิวเตอร์ สะดวกทุกที่ทุกเวลา"
          />
          <ServiceCard
            Icon={ShieldCheckIcon}
            title="ปลอดภัย มั่นใจได้"
            description="ระบบรีวิวและยืนยันตัวตน ช่วยสร้างความเชื่อมั่นในการแลกเปลี่ยน"
          />
        </div>
      </div>

      {/* ส่วน Feature Highlights */}
      <div className="bg-white/10 rounded-t-3xl py-12 px-4 sm:px-6 lg:px-8 shadow-xl mt-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 drop-shadow-lg">
          ฟีเจอร์เด็ดของเรา
        </h2>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 max-w-6xl mx-auto">
          <div className="flex-1 p-6 bg-white/5 rounded-lg shadow-md space-y-2">
            <h3 className="text-xl font-semibold">ระบบโพสต์สินค้า</h3>
            <p className="text-sm text-white/90">
              ให้คุณสร้าง แก้ไข หรือลบโพสต์ได้ทันที
              อัปโหลดรูปสินค้าและกำหนดจุดนัดพบผ่านแผนที่ได้ง่าย ๆ
            </p>
          </div>
          <div className="flex-1 p-6 bg-white/5 rounded-lg shadow-md space-y-2">
            <h3 className="text-xl font-semibold">ระบบคอมเมนต์ & ถูกใจ</h3>
            <p className="text-sm text-white/90">
              แสดงความคิดเห็นต่อโพสต์ และกดถูกใจโพสต์
              พร้อมทั้งดูจำนวนผู้กดถูกใจได้แบบเรียลไทม์
            </p>
          </div>
          <div className="flex-1 p-6 bg-white/5 rounded-lg shadow-md space-y-2">
            <h3 className="text-xl font-semibold">ระบบแชทส่วนตัว</h3>
            <p className="text-sm text-white/90">
              พูดคุยกับผู้ขายหรือผู้สนใจสินค้าในช่องทางส่วนตัวได้ทันที
              ไม่ต้องออกจากระบบ
            </p>
          </div>
        </div>
      </div>

      {/* ส่วน Footer */}
      <footer className="bg-gray-800 py-4 px-6 text-center text-sm text-white/80 mt-auto shadow-inner">
        <div>
          © {new Date().getFullYear()} ระบบแลกเปลี่ยนสินค้า | สร้างสรรค์ด้วย Next.js & Clerk
        </div>
      </footer>
    </div>
  );
}

/** 
 * คอมโพเนนต์แยกสำหรับไอคอนเทคโนโลยี (Marquee) 
 * ขยายขนาดให้เห็นเด่นขึ้น (เช่น 72x72) 
 */
function TechIcons() {
  return (
    <>
      <IconWrap label="Next.js">
        <Image src="/icons/nextjs-icon.png" alt="Next.js" width={72} height={72} />
      </IconWrap>

      <IconWrap label="Clerk">
        <Image src="/icons/clerk-icon.png" alt="Clerk" width={72} height={72} />
      </IconWrap>

      <IconWrap label="Supabase">
        <Image src="/icons/supabase-icon.png" alt="Supabase" width={72} height={72} />
      </IconWrap>

      <IconWrap label="React">
        <Image src="/icons/react-icon.png" alt="React" width={72} height={72} />
      </IconWrap>

      <IconWrap label="TypeScript">
        <Image
          src="/icons/typescript-icon.png"
          alt="TypeScript"
          width={72}
          height={72}
        />
      </IconWrap>

      <IconWrap label="Prisma">
        <Image src="/icons/prisma-icon.png" alt="Prisma" width={72} height={72} />
      </IconWrap>
    </>
  );
}

/** กำหนดชนิดข้อมูลของ props เพื่อแก้ Binding element 'label' implicitly has an 'any' type. */
interface IconWrapProps {
  label: string;
  children: ReactNode;
}

function IconWrap({ label, children }: IconWrapProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white/10 rounded-md shadow-md flex items-center justify-center">
        {children}
      </div>
      <span className="text-xs text-white/80 mt-1">{label}</span>
    </div>
  );
}

/** 
 * คอมโพเนนต์แสดงบริการ (Service Card) โดยใช้ Heroicons 
 * แทนการส่ง path ของรูป ก็ส่งเป็นไอคอนคอมโพเนนต์แทน
 */
interface ServiceCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function ServiceCard({ Icon, title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      {/* ขนาดและสีของ Heroicon ปรับได้ใน className */}
      <Icon className="w-16 h-16 text-white/90" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-white/90">{description}</p>
    </div>
  );
}
