"use client"

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categories = [
    'Art & Handmade', 'Baby', 'Beauty', 'Bikes', 'Books', 'Clothing & Accessories', 'Consumables', 'Electronics', 'Free Items', 'Furniture', 'Gift Cards', 'Grocery', 'Health', 'Hobbies & Crafts', 'Home', 'Jobs', 'Movies', 'Music', 'Office', 'Other', 'Pets', 'Plants', 'Services', 'Sports & Outdoors', 'Tools', 'Toys', 'Video Games'
  ];

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <>
      <div className="bg-light">
      <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-10 bg-cover bg-center py-20" style={{ backgroundImage: "url('/img/handshake.jpg')" }}>
  <div className="bg-white bg-opacity-50 p-8 rounded-md w-100 mx-auto">
    <h1 className="text-4xl font-bold mb-4 text-indigo-600">เริ่มต้นแลกเปลี่ยนได้แล้ววันนี้</h1>
    <p className="text-lg mb-6 text-gray-700">
      แลกเปลี่ยนทุกประเภท ตั้งแต่เสื้อผ้าและเฟอร์นิเจอร์ ไปจนถึงต้นไม้ในบ้านและงานศิลปะ
    </p>
    <div className="flex justify-center">
      <Link href="/api/auth/signup" className="bg-yellow-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75">
          เข้าร่วม
      </Link>
    </div>
  </div>
<section className="mb-8 max-w-lg mx-auto mt-10">
  <div className="relative">
    <input
      type="text"
      placeholder="Search in My Location"
      className="w-full p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
    />
    <div className="absolute right-4 top-4 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </div>
  </div>
</section>
</section>

<section className="mb-8">
  <div className='flex flex-col items-center mb-4'>
    <h2 className="text-4xl font-bold text-center mb-4">Popular Categories</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedCategories.map(category => (
              <Link key={category} href={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="block bg-gray-100 p-4 rounded-md text-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                {category}
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              {showAllCategories ? 'Show Less' : 'Show More'}
            </button>
          </div>
          </div>
        </section>

        <section className="text-center mb-8 py-20">
  <div className="max-w-xl mx-auto">
    <h2 className="text-5xl font-bold mb-4 text-gray-900">Kokan is about goods</h2>
    <p className="text-lg mb-6 text-gray-700">
      Kokan ก่อตั้งขึ้นในปี 2024 ด้วยความต้องการที่เรียบง่ายเพียงหนึ่งเดียว นั่นคือ โปรเจคจบ จากนั้น ข่าวดีเกี่ยวกับ Kokan ก็แพร่กระจายไปทั่วในงานปาร์ตี้ ร้านค้า นักศึกษา และด้วยเหตุนี้ จิตวิญญาณของ Kokan จึงถือกำเนิดขึ้น
    </p>
    <Link href="/about" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
        Explore more
    </Link>
  </div>
</section>

        {/* ส่วนอื่น ๆ ของหน้า */}
      </main>
      </div>
    </>
  );
}