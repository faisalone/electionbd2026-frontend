'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getAll, create, update, remove } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, Calendar, ArrowUp, ArrowDown, FileText } from 'lucide-react';

interface TimelineEvent {
  id: number;
  title: string;
  status: string;
  date: string;
  description: string;
  order: number;
}

export default function TimelinePage() {
  const { token } = useAdmin();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'অপেক্ষমান',
    date: '',
    description: '',
    order: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await getAll('timeline', token!);
      if (response.success) {
        setEvents(response.data.sort((a: TimelineEvent, b: TimelineEvent) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event?: TimelineEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        status: event.status,
        date: event.date,
        description: event.description,
        order: event.order.toString(),
      });
    } else {
      setEditingEvent(null);
      const nextOrder = events.length > 0 ? Math.max(...events.map(e => e.order)) + 1 : 1;
      setFormData({
        title: '',
        status: 'অপেক্ষমান',
        date: '',
        description: '',
        order: nextOrder.toString(),
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        await update('timeline', editingEvent.id, formData, token!);
      } else {
        await create('timeline', formData, token!);
      }
      await fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save timeline event:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await remove('timeline', id, token!);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'সম্পন্ন':
        return 'bg-green-100 text-green-600';
      case 'চলমান':
        return 'bg-blue-100 text-blue-600';
      case 'অপেক্ষমান':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#C8102E]" size={48} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Election Timeline
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Manage election timeline events</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500/50 to-emerald-500/50" />

            {/* Events */}
            <div className="space-y-8">
              {events.map((event, index) => (
                <div key={event.id} className="relative pl-20">
                  {/* Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-lg ${
                    event.status === 'সম্পন্ন' ? 'bg-green-500' :
                    event.status === 'চলমান' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />

                  {/* Card */}
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 p-6 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Order: {event.order}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Add Event'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    >
                      <option value="অপেক্ষমান">অপেক্ষমান</option>
                      <option value="চলমান">চলমান</option>
                      <option value="সম্পন্ন">সম্পন্ন</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="১ জানুয়ারি ২০২৬"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#C8102E] text-white py-3 rounded-xl font-semibold hover:bg-[#A00D24] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} />Save</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
