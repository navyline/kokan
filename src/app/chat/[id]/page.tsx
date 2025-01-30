"use client";

import React, { useEffect, useState } from 'react';
import { sendMessage, fetchMessages } from '@/app/actions/chatActions';

interface Message {
  id: string;
  senderId: string;
  content: string;
}

export default function ChatRoom({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // ดึงข้อความครั้งแรก (ตัวอย่างการใช้ Server Action ที่เรียกผ่าน fetch data)
  // หมายเหตุ: ถ้าจะดึง data เซิร์ฟเวอร์ฝั่ง client component อาจต้องผ่าน api route 
  //           หรือจะใช้ server action แบบใหม่ [experimental] 
  //           (ปัจจุบัน Next.js ยังมีข้อจำกัดเรื่องเรียก server action จาก client)
  
  useEffect(() => {
    async function loadMessages() {
      const msgs = await fetchMessages(chatId); 
      // อันนี้ ถ้าเป็น server action ตรง ๆ จะมีปัญหา "Direct calls from client not supported"
      // เว้นแต่ว่าคุณเปิดฟีเจอร์พิเศษ "server actions from client"
      // หรือทำผ่าน API route 
      
      setMessages(msgs);
    }
    loadMessages();
  }, [chatId]);

  // handle send
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const senderId = "someUserId"; // เปลี่ยนเป็น user ที่ล็อกอินจริง
    const msg = await sendMessage(chatId, senderId, newMessage); 
    // ส่งเสร็จลอง push msg เข้า state (หรือ reload)
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Chat Room: {chatId}</h1>
      <div style={{border: '1px solid #ccc', padding: 8, height: 300, overflowY: 'auto'}}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.senderId}:</b> {m.content}
          </div>
        ))}
      </div>
      <div style={{marginTop: 10}}>
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
