'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getAll, create, update, remove, getImageUrl } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, Award, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Party {
  id: number;
  name: string;
  name_en: string;
  logo: string | null;
  symbol_id: number | null;
  symbol?: { id: number; symbol_name: string; image: string };
  color: string;
  founded: string;
  candidates_count?: number;
}

export default function PartiesPage() {
  const { token } = useAdmin();
  const [parties, setParties] = useState<Party[]>([]);
  const [symbols, setSymbols] = useState<{ id: number; symbol_name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    symbol_id: null as number | null,
    color: '#6B7280',
    founded: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchParties();
      fetchSymbols();
    }
  }, [token]);

  const fetchParties = async () => {
    try {
      const response = await getAll('parties', token!);
      if (response.success) {
        setParties(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSymbols = async () => {
    try {
      const response = await getAll('symbols', token!);
      if (response.success) {
        setSymbols(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch symbols:', error);
    }
  };

  const handleOpenModal = (party?: Party) => {
    if (party) {
      setEditingParty(party);
      setFormData({
        name: party.name,
        name_en: party.name_en,
        symbol_id: party.symbol_id,
        color: party.color,
        founded: party.founded || '',
      });
      setLogoPreview(party.logo ? getImageUrl(party.logo) : null);
    } else {
      setEditingParty(null);
      setFormData({
        name: '',
        name_en: '',
        symbol_id: null,
        color: '#6B7280',
        founded: '',
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingParty(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });
      
      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      if (editingParty) {
        await update('parties', editingParty.id, submitData, token!, true);
        toast.success('Party updated successfully!');
      } else {
        await create('parties', submitData, token!, true);
        toast.success('Party created successfully!');
      }
      await fetchParties();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save party:', error);
      toast.error('Failed to save party. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove('parties', id, token!);
      await fetchParties();
      toast.success('Party deleted successfully!');
    } catch (error) {
      console.error('Failed to delete party:', error);
      toast.error('Failed to delete party. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Award className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Political Parties
            </h1>
          </div>
          <p className="text-gray-600 ml-13">Manage political parties and their information</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{parties.length}</span> parties
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Party</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Loading parties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parties.map((party) => (
              <div
                key={party.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                    {party.logo && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src={getImageUrl(party.logo)}
                          alt={party.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                        {party.name}
                      </h3>
                      <p className="text-sm text-gray-500">{party.name_en}</p>
                    </div>
                  </div>

                  <div className="mb-4 space-y-3">
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">নির্বাচনী প্রতীক</p>
                      <p className="text-sm font-bold text-purple-600">
                        {party.symbol?.symbol_name || 'নির্ধারিত নয়'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">প্রতিষ্ঠা</p>
                        <p className="text-sm font-bold text-blue-600">{party.founded || 'N/A'}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">প্রার্থী</p>
                        <p className="text-sm font-bold text-green-600">{party.candidates_count || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(party)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                    >
                      <Edit2 size={16} />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: party.id })}
                      className="flex items-center justify-center px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {editingParty ? 'Edit Party' : 'Add Party'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/50 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Party Logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 object-contain rounded-xl bg-white/50 p-2 border border-gray-200"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 bg-white/50 hover:bg-white/70 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 transition-all">
                        <Upload size={20} className="text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {logoPreview ? 'Change Logo' : 'Upload Logo'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG (max 2MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (Bengali)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symbol (Optional)</label>
                  <select
                    value={formData.symbol_id || ''}
                    onChange={(e) => setFormData({ ...formData, symbol_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                  >
                    <option value="">No Symbol</option>
                    {symbols.map((symbol) => (
                      <option key={symbol.id} value={symbol.id}>
                        {symbol.symbol_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Assign an election symbol to this party</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded</label>
                  <input
                    type="text"
                    value={formData.founded}
                    onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                    placeholder="১৯৪৯"
                  />
                </div>

                <div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-white/50 hover:bg-white/70 text-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingParty ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
          onConfirm={() => {
            if (deleteConfirm.id) handleDelete(deleteConfirm.id);
          }}
          title="Delete Party"
          description="Are you sure you want to delete this party? This action cannot be undone."
        />
      </div>
    </ProtectedRoute>
  );
}
