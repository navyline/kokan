'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Kokan</h2>
            <p className="text-sm">แลกเปลี่ยนในท้องถิ่นกับผู้คนในเมืองของคุณ ค้นหาสิ่งที่คุณชอบ เช่น เสื้อผ้า เฟอร์นิเจอร์ งานศิลปะ และอื่นๆ อีกมากมาย</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/explore" className="hover:underline">Explore</Link>
            <Link href="/cities" className="hover:underline">Cities</Link>
            <Link href="/support" className="hover:underline">Support</Link>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Link href="#" className="hover:underline">Facebook</Link>
            <Link href="#" className="hover:underline">Instagram</Link>
            <Link href="#" className="hover:underline">LinkedIn</Link>
          </div>
          <p className="text-sm">© 2024 Kokan Inc.</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link href="/privacy" className="hover:underline">Privacy & Terms</Link>
        </div>
      </div>
    </footer>
  );
}