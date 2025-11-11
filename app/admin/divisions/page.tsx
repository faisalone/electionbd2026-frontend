'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getAll, create, update, remove } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, MapPin } from 'lucide-react';

interface Division {
  id: number;
  name: string;
  name_en: string;
  total_seats: number;
  districts_count?: number;
  seats_count?: number;
}

export default function DivisionsPage() {
  const { token } = useAdmin();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [formData, setFormData] = useState({ name: '', name_en: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDivisions();
    }
  }, [token]);

  const fetchDivisions = async () => {
    try {
      const response = await getAll('divisions', token!);
      if (response.success) {
        setDivisions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (division?: Division) => {
    if (division) {
      setEditingDivision(division);
      setFormData({ name: division.name, name_en: division.name_en });
    } else {
      setEditingDivision(null);
      setFormData({ name: '', name_en: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDivision(null);
    setFormData({ name: '', name_en: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingDivision) {
        await update('divisions', editingDivision.id, formData, token!);
      } else {
        await create('divisions', formData, token!);
      }
      await fetchDivisions();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save division:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this division?')) return;

    try {
      await remove('divisions', id, token!);
      await fetchDivisions();
    } catch (error) {
      console.error('Failed to delete division:', error);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Divisions</h1>
            <p className="text-gray-600">Manage all divisions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A00D24] transition-all hover:shadow-lg"
          >
            <Plus size={20} />
            Add Division
          </button>
        </div>

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {divisions.map((division) => (
            <div
              key={division.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{division.name}</h3>
                    <p className="text-sm text-gray-500">{division.name_en}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 text-sm text-gray-600 mb-4">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-semibold text-gray-900">{division.districts_count || 0}</div>
                  <div className="text-xs">Districts</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-semibold text-gray-900">{division.seats_count || division.total_seats}</div>
                  <div className="text-xs">Seats</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(division)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(division.id)}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingDivision ? 'Edit Division' : 'Add Division'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Bengali)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
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
                    {saving ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} />
                        Save
                      </>
                    )}
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
