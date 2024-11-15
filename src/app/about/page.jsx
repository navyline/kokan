"use client";

import Link from 'next/link';

export default function AboutPage() {
  const sections = [
    {
      title: "แลกเปลี่ยนสิ่งที่คุณไม่ต้องการกับสิ่งที่คุณต้องการ",
      content: "Kokan ไม่ใช่กลุ่มซื้อ-ขาย แต่เป็นสถานที่ที่ผู้คนแลกเปลี่ยนสิ่งดีๆ กัน",
      backgroundColor: "bg-purple-300",
      textColor: "text-purple-800"
    },
    {
      title: "จัดระเบียบชีวิตของคุณ",
      content: "ทิ้งของเก่าแล้วรับของใหม่มา มีของที่คืนไม่ได้หรือไม่ ได้รับของขวัญที่ไม่มีวันได้ใช้หรือไม่ อบคุกกี้มากเกินไปหรือไม่ หาคนที่ต้องการของของคุณแล้วรับของเจ๋งๆ กลับไป",
      backgroundColor: "bg-blue-300",
      textColor: "text-blue-800"
    },
    {
      title: "ประหยัดเงินของคุณ",
      content: "ตรวจสอบ Kokan ก่อนซื้อ เมื่อเจนย้ายเข้าไปอยู่ในอพาร์ตเมนต์ใหม่ เธอสามารถตกแต่งห้องได้อย่างเต็มที่โดยใช้ Kokan ไม่ว่าจะเป็นเก้าอี้ หมอนอิง โครงเตียงขนาดเต็ม หรือเครื่องชงกาแฟแบบเฟรนช์เพรส เจนบอกว่าเธอพบทุกอย่างใน Kokan และประหยัดเงินไปได้หลายพันดอลลาร์",
      backgroundColor: "bg-yellow-300",
      textColor: "text-yellow-800"
    },
    {
      title: "Ditch the mainstream",
      content: "ไม่อนุญาตให้ใช้เงิน มีเพียงการซื้อขายที่ยอดเยี่ยม เข้าร่วมกับผู้คนที่มีแนวคิดเหมือนกันและทำสิ่งต่างๆ แตกต่างออกไป ค้นพบการซื้อขายใหม่ๆ ทุกวันและมีส่วนสนับสนุนชุมชน",
      backgroundColor: "bg-green-300",
      textColor: "text-green-800"
    },
    {
      title: "ลดขยะในท้องถิ่น",
      content: "ร่วมเป็นส่วนหนึ่งในการช่วยเหลือโลก ในแต่ละวันมีการซื้อขายสินค้าหลายพันรายการผ่าน Kokan ทำให้มีของต่างๆ มากขึ้นที่ไม่ต้องนำไปฝังกลบและช่วยลดการบริโภคนิยม ซื้อของใหม่ นำของเก่ามาใช้ซ้ำ และปกป้องโลก นี่คือผลประโยชน์ของทุกฝ่าย",
      backgroundColor: "bg-pink-300",
      textColor: "text-pink-800"
    },
    {
      title: "Meet cool people",
      content: "ค้นพบชุมชน สร้างมิตรภาพ Kokan เป็นมากกว่าแพลตฟอร์มแลกเปลี่ยนสินค้า เป็นชุมชนที่มีชีวิตชีวา ครอบคลุม เป็นมิตร และให้ความช่วยเหลือ ค้นหาผู้คนที่มีความสนใจเหมือนกัน ค้นพบเมืองของคุณอีกครั้ง และสร้างมิตรภาพใหม่ๆ",
      backgroundColor: "bg-red-300",
      textColor: "text-red-800"
    },
    {
      title: "Trade services",
      content: "อย่าหยุดอยู่แค่เรื่องเดียว แลกเปลี่ยนบริการกันด้วย เสนอบริการออกแบบฟรีแลนซ์ เล่นกีตาร์และอยากสอนคนอื่นด้วยไหม ต้องการความช่วยเหลือด้านงานสวนไหม Kokan เป็นสถานที่แลกเปลี่ยนบริการเช่นกัน แลกทักษะของคุณเพื่อสิ่งของเจ๋งๆ และรับความช่วยเหลือที่คุณต้องการโดยแลกเปลี่ยนมัน",
      backgroundColor: "bg-orange-300",
      textColor: "text-orange-800"
    }
  ];

  return (
    <main className="container mx-auto px-3 py-8 bg-teal-100">
      {sections.map((section, index) => (
        <section
          key={index}
          className={`${section.backgroundColor} ${section.textColor} text-center mb-8 py-20 rounded-md shadow-lg`}
        >
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
            <p className="text-lg mb-6">{section.content}</p>
          </div>
        </section>
      ))}
      <div className="text-center mt-8">
        <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Go back to Home
        </Link>
      </div>
    </main>
  );
}
