"use client";

import { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { Send, Loader2, ArrowLeft, Bot, User } from "lucide-react";
import Link from "next/link";

export default function ChatPage({ params }: { params: Promise<{ session_id: string }> }) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat/sessions/${resolvedParams.session_id}/messages`)
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load chat history", err);
        setLoading(false);
      });
  }, [resolvedParams.session_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput("");
    setSending(true);

    // Optimistic UI update
    setMessages(prev => [...prev, { role: "user", content: userMsg, id: Date.now().toString() }]);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat/sessions/${resolvedParams.session_id}/messages`, {
        user_id: "00000000-0000-0000-0000-000000000000",
        content: userMsg
      });
      // Replace optimistic message with actual DB messages
      setMessages(prev => [...prev.filter(m => m.id !== Date.now().toString()), res.data.user_message, res.data.ai_message]);
    } catch (err) {
      console.error("Failed to send message", err);
      // Optionally show error toast
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          <Bot className="w-6 h-6 mr-2 text-blue-600" />
          VisionQuery Assistant
        </h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Ask me anything about the objects, text, or people in the image!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-green-600 mr-3'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'}`}>
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="w-8 h-8 rounded-full bg-green-600 mr-3 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border text-gray-800 rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the image..."
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
