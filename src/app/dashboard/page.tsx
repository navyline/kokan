"use client";

import { useEffect, useState } from "react";
import { fetchUserTrades } from "./actions";
import Link from "next/link";
import { Trade } from "@/utils/types";

export default function TradeDashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrades = async () => {
      try {
        const data = await fetchUserTrades();
        setTrades(data);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setLoading(false);
      }
    };

    getTrades();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📌 Trade Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : trades.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่มีข้อเสนอแลกเปลี่ยน</p>
      ) : (
        trades.map((trade) => (
          <div key={trade.id} className="border p-4 rounded-lg shadow mb-4 bg-white">
            <h2 className="font-semibold">แลกเปลี่ยนกับ: {trade.offerTo.firstName}</h2>
            <p>🛍️ สินค้าของคุณ: {trade.postOffered?.name || "ไม่มีสินค้าแนบ"}</p>
            <p>🎁 สินค้าที่ต้องการ: {trade.postWanted?.name || "ไม่มีสินค้าแนบ"}</p>
            <p className="text-sm">📅 วันที่เสนอ: {new Date(trade.createdAt).toLocaleDateString()}</p>
            <p className="font-semibold text-blue-600">📌 สถานะ: {trade.status}</p>

            <Link href={`/chat/${trade.id}`} className="mt-2 text-blue-500 underline">
              💬 เปิดการสนทนา
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
