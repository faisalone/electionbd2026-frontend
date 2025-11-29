'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getWhatsAppConversations, getWhatsAppMessages, searchWhatsAppUsers, sendWhatsAppReply, startWhatsAppConversation } from '@/lib/admin/api';
import { MessageCircle, Send, Search, CheckCheck, Check, Clock, Phone, X, Plus, Loader2, Sparkles } from 'lucide-react';
import echo from '@/lib/echo';

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
  metadata?: Record<string, unknown> | null;
  status: string | null;
  message_timestamp: string;
  is_read: boolean;
  admin_name: string | null;
  formatted_time: string;
}

interface MessageReceivedPayload {
  message: Message;
  conversation: Conversation;
}

interface MessageStatusPayload {
  message_id: string;
  status: 'sent' | 'delivered' | 'read' | string;
  phone_number: string;
}

interface UserSearchResult {
  id: number;
  name: string;
  phone_number: string;
  avatar?: string | null;
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
  const [showStartModal, setShowStartModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [userSearchError, setUserSearchError] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualName, setManualName] = useState('');
  const [startError, setStartError] = useState('');
  const [sendingWelcome, setSendingWelcome] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottomIfNeeded = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const hasOverflow = container.scrollHeight > container.clientHeight;
    if (hasOverflow) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const fetchConversations = useCallback(async () => {
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
  }, [token]);

  const fetchMessages = useCallback(async (phoneNumber: string) => {
    if (!token) return;
    try {
      const data = await getWhatsAppMessages(phoneNumber, token);
      if (data.success) {
        setMessages(data.data);
        setConversations(prev =>
          prev.map(conv =>
            conv.phone_number === phoneNumber
              ? { ...conv, unread_count: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchConversations();
  }, [token, fetchConversations]);

  useEffect(() => {
    if (!selectedConversation?.phone_number) return;
    fetchMessages(selectedConversation.phone_number);
  }, [selectedConversation?.phone_number, fetchMessages]);

  useEffect(() => {
    const echoInstance = echo;
    const channelName = 'whatsapp.messages';
    if (!token || !echoInstance) return;
    const channel = echoInstance.channel(channelName);

    const handleMessageReceived = (data: MessageReceivedPayload) => {
      // Update conversations list
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.phone_number === data.conversation.phone_number);
        const isSelectedConversation = selectedConversation?.phone_number === data.conversation.phone_number;
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            last_message: data.conversation.last_message,
            last_message_time: data.conversation.last_message_time,
            // Don't increment unread count if conversation is currently selected and message is incoming
            unread_count: data.message.direction === 'incoming' && !isSelectedConversation
              ? (updated[existingIndex].unread_count || 0) + 1 
              : isSelectedConversation ? 0 : updated[existingIndex].unread_count,
          };
          // Move to top
          updated.unshift(updated.splice(existingIndex, 1)[0]);
          return updated;
        } else {
          // New conversation
          return [data.conversation, ...prev];
        }
      });

      // Only append incoming user messages for the selected conversation
      if (
        selectedConversation &&
        data.message.direction === 'incoming' &&
        data.message.from === selectedConversation.phone_number
      ) {
        setMessages(prev => [...prev, data.message]);
        setTimeout(() => scrollToBottomIfNeeded(), 100);
      }
    };

    const handleMessageStatus = (data: MessageStatusPayload) => {
      setMessages(prev =>
        prev.map(message =>
          message.message_id === data.message_id
            ? { ...message, status: data.status }
            : message
        )
      );
    };

    channel.listen('.message.received', handleMessageReceived);
    channel.listen('.message.status', handleMessageStatus);

    return () => {
      channel.stopListening('.message.received');
      channel.stopListening('.message.status');
      echoInstance.leaveChannel(channelName);
    };
  }, [token, selectedConversation?.phone_number, scrollToBottomIfNeeded]);

  useEffect(() => {
    if (!showStartModal || !token) {
      return;
    }

    if (!userSearch.trim()) {
      setUserResults([]);
      setSearchingUsers(false);
      setUserSearchError('');
      return;
    }

    setSearchingUsers(true);
    const handler = setTimeout(async () => {
      try {
        const response = await searchWhatsAppUsers(userSearch, token);
        if (response.success) {
          setUserResults(response.data);
          setUserSearchError('');
        } else {
          setUserSearchError(response.message || 'ব্যবহারকারী খুঁজে পাওয়া যায়নি');
        }
      } catch (error) {
        console.error('Failed to search users:', error);
        setUserSearchError('ইউজার তালিকা লোড করতে ব্যর্থ');
      } finally {
        setSearchingUsers(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [userSearch, token, showStartModal]);

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottomIfNeeded();
    }
  }, [selectedConversation, scrollToBottomIfNeeded]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottomIfNeeded();
    }
  }, [messages.length, scrollToBottomIfNeeded]);

  const normalizePhone = (value: string) => value.replace(/[^0-9+]/g, '');

  const closeStartModal = () => {
    setShowStartModal(false);
    setUserSearch('');
    setUserResults([]);
    setUserSearchError('');
    setManualPhone('');
    setManualName('');
    setStartError('');
  };

  const startConversationForPhone = async (rawPhone: string, displayName?: string, skipWelcome: boolean = false) => {
    const normalized = normalizePhone(rawPhone);

    if (normalized.length < 10) {
      setStartError('সঠিক ফোন নম্বর লিখুন');
      return;
    }

    // Check if conversation already exists
    const existingConversation = conversations.find(c => c.phone_number === normalized);
    
    if (existingConversation) {
      // Just open existing conversation
      setSelectedConversation(existingConversation);
      closeStartModal();
      return;
    }

    // For new conversations, send welcome template first
    if (!skipWelcome && token) {
      setSendingWelcome(true);
      setStartError('');
      
      try {
        const result = await startWhatsAppConversation(normalized, token);
        
        if (result.success) {
          // Create conversation entry
          const newConversation: Conversation = {
            phone_number: normalized,
            name: displayName || 'Unknown',
            last_message: 'Welcome message sent',
            last_message_time: new Date().toISOString(),
            message_count: 1,
            unread_count: 0,
            last_message_type: 'template',
          };
          
          setConversations(prev => [newConversation, ...prev]);
          setSelectedConversation(newConversation);
          
          // Fetch actual messages
          await fetchMessages(normalized);
          await fetchConversations();
          
          closeStartModal();
        } else {
          setStartError(result.message || 'Failed to send welcome message');
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        setStartError('Failed to start conversation. Please try again.');
      } finally {
        setSendingWelcome(false);
      }
      return;
    }

    // Fallback: just create conversation locally (old behavior)
    const newConversation: Conversation = {
      phone_number: normalized,
      name: displayName || 'Unknown',
      last_message: 'New conversation',
      last_message_time: new Date().toISOString(),
      message_count: 0,
      unread_count: 0,
      last_message_type: 'text',
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
    closeStartModal();
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
        setMessages(prev => [...prev, data.data]);
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
          <div className="flex flex-wrap items-center justify-between gap-4">
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
            <button
              type="button"
              onClick={() => setShowStartModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-green-600 hover:to-emerald-700"
            >
              <Plus size={16} />
              নতুন কনভার্সেশন
            </button>
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
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
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

      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-600">Start Conversation</p>
                <h2 className="text-2xl font-bold text-gray-900">Send a new WhatsApp message</h2>
                <p className="mt-1 text-sm text-gray-500">Find a registered user or start with any Bangladeshi phone number.</p>
              </div>
              <button onClick={closeStartModal} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Search registered users</h3>
                  <span className="text-xs text-gray-500">Up to 15 results</span>
                </div>
                <div className="mt-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserSearchError('');
                      }}
                      placeholder="Search by name or phone"
                      className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  {userSearchError && <p className="mt-2 text-sm text-red-500">{userSearchError}</p>}
                </div>
                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {searchingUsers ? (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-emerald-200 py-6 text-emerald-600">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching users...
                    </div>
                  ) : userResults.length > 0 ? (
                    userResults.map((user) => {
                      const existingConversation = conversations.find((conv) => conv.phone_number === user.phone_number);
                      return (
                        <div
                          key={`${user.id}-${user.phone_number}`}
                          className="flex items-center justify-between rounded-2xl border border-white bg-white/70 px-3 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-400 to-green-500 text-sm font-bold text-white flex items-center justify-center">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name || 'Unnamed user'}</p>
                              <p className="text-sm text-gray-500">{user.phone_number}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => startConversationForPhone(user.phone_number, user.name)}
                            className="rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:bg-emerald-50"
                          >
                            {existingConversation ? 'Open chat' : 'Start chat'}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                      {userSearch.trim() ? 'No users found. Try a different search.' : 'Start typing to search registered users.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-800">Start with a phone number</h3>
                <p className="mt-1 text-sm text-gray-500">Send a proactive WhatsApp message to any Bangladeshi number.</p>
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => {
                      setManualPhone(normalizePhone(e.target.value));
                      setStartError('');
                    }}
                    placeholder="Phone number (e.g. 017XXXXXXXX)"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Contact name (optional)"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  {startError && <p className="text-sm text-red-500">{startError}</p>}
                  <button
                    type="button"
                    onClick={() => startConversationForPhone(manualPhone, manualName || undefined)}
                    className="w-full rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                    disabled={!manualPhone || sendingWelcome}
                  >
                    {sendingWelcome ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending welcome message...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Send Welcome & Start Chat
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    ✨ Sends Bengali welcome template to open 24-hour free messaging window
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
