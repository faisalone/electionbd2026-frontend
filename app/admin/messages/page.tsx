'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getWhatsAppConversations, getWhatsAppMessages, sendWhatsAppReply } from '@/lib/admin/api';
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

  useEffect(() => {
    if (!token) return;
    
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (selectedConversation && token) {
      fetchMessages(selectedConversation.phone_number);
      const interval = setInterval(() => fetchMessages(selectedConversation.phone_number), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, token]);

  // Only scroll on initial load or when sending a message
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [selectedConversation]); // Only scroll when conversation changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    if (!token) return;
    
    try {
      const data = await getWhatsAppConversations(token);
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
    if (!token) return;
    
    try {
      const data = await getWhatsAppMessages(phoneNumber, token);
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation || !token) return;

    const messageToSend = replyText;
    setReplyText(''); // Clear immediately for better UX
    setSending(true);

    try {
      const data = await sendWhatsAppReply(selectedConversation.phone_number, messageToSend, token);
      if (data.success) {
        // Add the sent message to the list
        setMessages([...messages, data.data]);
        // Scroll to bottom after sending
        setTimeout(() => scrollToBottom(), 100);
        fetchConversations(); // Update conversation list
      } else {
        alert('Failed to send message: ' + (data.message || 'Unknown error'));
        setReplyText(messageToSend); // Restore message on error
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send message');
      setReplyText(messageToSend); // Restore message on error
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                WhatsApp Messages
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">Manage customer conversations and send replies</p>
            </div>
          </div>
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
                <div className="p-4 border-b border-gray-200 bg-linear-to-r from-green-50 to-emerald-50">
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
                            ? 'bg-linear-to-br from-green-500 to-emerald-600 text-white'
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
                  <div className="relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="w-full pl-4 pr-14 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      onClick={sendReply}
                      disabled={sending || !replyText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-linear-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                      title={sending ? "Sending..." : "Send message"}
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
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
