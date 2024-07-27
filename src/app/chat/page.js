'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Chat = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.data);
    };

    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!session) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: session.user.id,
        receiver: 'some-user-id', // Replace with actual receiver ID
        content,
      }),
    });

    if (res.ok) {
      setContent('');
      const newMessage = await res.json();
      setMessages([...messages, newMessage.data]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Chat</h1>
      <div className="flex flex-col space-y-4">
        <ul className="w-full">
          {messages.map((message) => (
            <li key={message._id} className="border p-2 rounded mb-2">
              <p><strong>{message.sender.name}:</strong> {message.content}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSend} className="flex flex-col space-y-2 w-full">
          <textarea
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
