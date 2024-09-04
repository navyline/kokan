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
      <div className="bg-yellow-100">
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-8 bg-cover bg-center py-20" style={{ backgroundImage: "url('/img/handshake.jpg')" }}>
          <div className="bg-white bg-opacity-75 p-8 rounded-md">
            <h1 className="text-4xl font-bold mb-4 text-indigo-600">เริ่มต้นแลกเปลี่ยนได้แล้ววันนี้</h1>
            <p className="text-lg mb-6 text-gray-700">
              แลกเปลี่ยนทุกประเภท ตั้งแต่เสื้อผ้าและเฟอร์นิเจอร์ ไปจนถึงต้นไม้ในบ้านและงานศิลปะ
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/api/auth/signup" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                เข้าร่วม
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <input
            type="text"
            placeholder="Search in My Location"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            aria-label="Search in My Location"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Popular categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedCategories.map(category => (
              <Link key={category} href={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="block bg-gray-100 p-4 rounded-md text-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                {category}
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {showAllCategories ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </section>

        <section
          className="text-center mb-8 bg-cover bg-center py-20"
          style={{ backgroundImage: "url('/img/handshake.jpg')" }}
        >
          <div className="bg-black bg-opacity-50 p-8 rounded-md">
            <h2 className="text-4xl font-bold mb-4 text-white">Kokan is about goods</h2>
            <p className="text-lg mb-6 text-white">
            Kokan ก่อตั้งขึ้นในปี 2024 ด้วยความต้องการที่เรียบง่ายเพียงหนึ่งเดียว นั่นคือ โปรเจคจบ จากนั้น ข่าวดีเกี่ยวกับ Kokan ก็แพร่กระจายไปทั่วในงานปาร์ตี้ ร้านค้า นักศึกษา และด้วยเหตุนี้ จิตวิญญาณของ Kokan จึงถือกำเนิดขึ้น
            </p>
            <Link href="/about" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
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