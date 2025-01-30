import { useEffect, useState } from "react";
import supabaseClient from "@/utils/supabaseClient";

export const useRealtimeMessages = (chatId: string) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // ดึงข้อความที่มีอยู่
    const fetchMessages = async () => {
      const { data } = await supabaseClient
        .from("Message")
        .select("*")
        .eq("chatId", chatId)
        .order("createdAt", { ascending: true });

      setMessages(data || []);
    };

    fetchMessages();

    // ตั้งค่า Realtime Listener
    const messageListener = supabaseClient
      .channel("public:Message")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        (payload) => {
          if (payload.new.chatId === chatId) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(messageListener);
    };
  }, [chatId]);

  return messages;
};
