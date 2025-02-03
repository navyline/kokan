import { fetchUserTrades, updateTradeStatus } from "./actions";
import Link from "next/link";

export default async function TradeDashboard() {
  const trades = await fetchUserTrades(); // 🔹 ดึงรายการแลกเปลี่ยนทั้งหมดของผู้ใช้

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📌 Trade Dashboard</h1>

      {trades.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่มีข้อเสนอแลกเปลี่ยน</p>
      ) : (
        trades.map((trade) => (
          <div key={trade.id} className="border p-4 rounded-lg shadow mb-4 bg-white">
            <h2 className="font-semibold">แลกเปลี่ยนกับ: {trade.offerTo.firstName}</h2>
            <p>🛍️ สินค้าของคุณ: {trade.postOffered?.name || "ไม่มีสินค้าแนบ"}</p>
            <p>🎁 สินค้าที่ต้องการ: {trade.postWanted?.name || "ไม่มีสินค้าแนบ"}</p>
            <p className="text-sm">📅 วันที่เสนอ: {new Date(trade.createdAt).toLocaleDateString()}</p>
            <p className="font-semibold text-blue-600">📌 สถานะ: {trade.status}</p>

            {/* ✅ ปุ่มตอบรับ / ปฏิเสธข้อเสนอ */}
            {trade.status === "PENDING" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateTradeStatus(trade.id, "ACCEPTED")} // ✅ แก้ไขให้ส่ง 2 arguments
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
                >
                  ✅ ตอบรับ
                </button>
                <button
                  onClick={() => updateTradeStatus(trade.id, "REJECTED")} // ✅ แก้ไขให้ส่ง 2 arguments
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
                >
                  ❌ ปฏิเสธ
                </button>
              </div>
            )}

            {/* ✅ ปุ่มเข้าสู่ระบบแชท */}
            <Link href={`/chat/${trade.id}`} className="mt-2 text-blue-500 underline">
              💬 เปิดการสนทนา
            </Link>

            {/* ✅ ปุ่มยืนยันเมื่อแลกเปลี่ยนสำเร็จ */}
            {trade.status === "ACCEPTED" && (
              <button
                onClick={() => updateTradeStatus(trade.id, "COMPLETED")} // ✅ แก้ไขให้ส่ง 2 arguments
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              >
                🏆 ยืนยันการแลกเปลี่ยน
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
