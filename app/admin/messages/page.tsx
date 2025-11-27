'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { MessageCircle, Send, Search, CheckCheck, Check, Clock, Phone, X } from 'lucide-react';

interface Conversation {
  phone_number: string;
  name: string;
  last_message: string;
  last_message_time: string;
  message_count: number;
  unread_count: number;
  last_message_type: string;
}

interface Message {
  id: number;
  message_id: string;
  from: string;
  from_name: string;
  to: string;
  direction: 'incoming' | 'outgoing';
  type: string;
  content: string;
  metadata: any;
  status: string | null;
  message_timestamp: string;
  is_read: boolean;
  admin_name: string | null;
  formatted_time: string;
}

export default function MessagesPage() {
  const { token } = useAdmin();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '/admin') || 'http://localhost:8000/api/admin';

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.phone_number);
      const interval = setInterval(() => fetchMessages(selectedConversation.phone_number), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (phoneNumber: string) => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/conversations/${phoneNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await fetch(`${API_BASE}/whatsapp/reply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: selectedConversation.phone_number,
          message: replyText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setReplyText('');
        fetchConversations();
      } else {
        alert('Failed to send message: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone_number.includes(searchQuery)
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8102E] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-rrom-gray-800 to-gray-600 bg-clip-text text-transparent">
              WhatsApp Messages
            </h1>
          </div>
          <p className="text-gray-600 ml-13">Manage customer conversations and send replies</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.phone_number}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation?.phone_number === conv.phone_number ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shrink-0">
                          {conv.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                            {conv.unread_count > 0 && (
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mb-1">{conv.last_message}</p>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{conv.phone_number}</span>
                            <span className="text-xs text-gray-400 ml-auto">{formatTime(conv.last_message_time)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-linear-to-rrom-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {selectedConversation.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                        <p className="text-sm text-gray-500">{selectedConversation.phone_number}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-white/50 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.direction === 'outgoing'
                            ? 'bg-linear-to-brrom-green-500 to-emerald-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-2 text-xs ${
                            msg.direction === 'outgoing' ? 'text-green-100' : 'text-gray-500'
                          }`}
                        >
                          <span>{formatTime(msg.message_timestamp)}</span>
                          {msg.direction === 'outgoing' && (
                            <>
                              {msg.status === 'delivered' && <CheckCheck size={14} />}
                              {msg.status === 'read' && <CheckCheck size={14} className="text-blue-300" />}
                              {msg.status === 'sent' && <Check size={14} />}
                              {!msg.status && <Clock size={14} />}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      rows={2}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || sending}
                      className="px-6 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={20} />
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                  <MessageCircle size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
