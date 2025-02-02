import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          {/* โลโก้และคำอธิบาย */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Kokan</h2>
            <p className="text-gray-400">
              Kokan เป็นแพลตฟอร์มสำหรับการแลกเปลี่ยนสิ่งของและเครื่องมือที่เหมาะกับทุกคน
              สร้างสรรค์สังคมแห่งการแบ่งปันและความยั่งยืน
            </p>
          </div>

          {/* ลิงก์สำคัญ */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">ลิงก์สำคัญ</h3>
            <ul>
              <li className="mb-2">
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition">
                  วิธีการใช้งาน
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* การติดตามเรา */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">ติดตามเรา</h3>
            <p className="text-gray-400 mb-4">
              ติดตามเราบนโซเชียลมีเดียเพื่อรับข่าวสารและอัปเดตล่าสุด
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/kokan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://www.twitter.com/kokan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com/kokan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/kokan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        {/* ลิขสิทธิ์ */}
        <div className="text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Kokan. สงวนลิขสิทธิ์.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
