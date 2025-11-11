'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin/context';
import { Hash, Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { getAll, create, update, remove, getImageUrl } from '@/lib/admin/api';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Symbol {
  id: number;
  image: string;
  symbol_name: string;
  is_available: boolean;
  candidates_count?: number;
}

interface FormData {
  symbol_name: string;
  is_available: boolean;
}

interface DeleteConfirm {
  isOpen: boolean;
  id: number | null;
}

export default function SymbolsPage() {
  const { token } = useAdmin();
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    symbol_name: '',
    is_available: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    loadSymbols();
  }, [token]);

  const loadSymbols = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAll('symbols', token);
      setSymbols(data.data || []);
    } catch (error) {
      console.error('Failed to load symbols:', error);
      toast.error('Failed to load symbols');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (symbol?: Symbol) => {
    if (symbol) {
      setEditingId(symbol.id);
      setFormData({
        symbol_name: symbol.symbol_name,
        is_available: symbol.is_available,
      });
      setImagePreview(symbol.image ? getImageUrl(symbol.image) : null);
    } else {
      setEditingId(null);
      setFormData({
        symbol_name: '',
        is_available: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      symbol_name: '',
      is_available: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validate image for new symbols
    if (!editingId && !imageFile) {
      toast.error('Please select a symbol image');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('symbol_name', formData.symbol_name);
      formDataToSend.append('is_available', formData.is_available ? '1' : '0');
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingId) {
        await update('symbols', editingId, formDataToSend, token, true);
        toast.success('Symbol updated successfully');
      } else {
        await create('symbols', formDataToSend, token, true);
        toast.success('Symbol created successfully');
      }

      handleCloseModal();
      loadSymbols();
    } catch (error: any) {
      console.error('Failed to save symbol:', error);
      toast.error(error.response?.data?.message || 'Failed to save symbol');
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteConfirm.id) return;

    try {
      await remove('symbols', deleteConfirm.id, token);
      toast.success('Symbol deleted successfully');
      setDeleteConfirm({ isOpen: false, id: null });
      loadSymbols();
    } catch (error: any) {
      console.error('Failed to delete symbol:', error);
      toast.error(error.response?.data?.message || 'Failed to delete symbol');
    }
  };

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Hash className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Symbols
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Manage election symbols for candidates</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Symbol</span>
          </button>
        </div>
      </div>

      {/* Symbols Grid */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : symbols.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Hash className="mx-auto mb-4 text-gray-400" size={48} />
            <p>No symbols found. Add your first symbol!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {symbols.map((symbol) => (
              <div
                key={symbol.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                  <div className="p-6">
                    {symbol.image ? (
                      <>
                        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                          <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                            <img 
                              src={getImageUrl(symbol.image)} 
                              alt={symbol.symbol_name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pt-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                              {symbol.symbol_name}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${
                              symbol.is_available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {symbol.is_available ? 'উপলব্ধ' : 'বরাদ্দকৃত'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                          {symbol.symbol_name}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${
                          symbol.is_available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {symbol.is_available ? 'উপলব্ধ' : 'বরাদ্দকৃত'}
                        </span>
                      </div>
                    )}                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(symbol)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                    >
                      <Edit2 size={16} />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: symbol.id })}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Symbol' : 'Add Symbol'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symbol Image {!editingId && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="symbol-image"
                      />
                      <label
                        htmlFor="symbol-image"
                        className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={20} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {imageFile ? imageFile.name : 'Choose image...'}
                        </span>
                      </label>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-purple-200">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symbol Name (Bangla) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.symbol_name}
                  onChange={(e) => setFormData({ ...formData, symbol_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white/50"
                  placeholder="তারকা"
                  required
                />
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Available for use</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-purple-600 peer-focus:ring-4 peer-focus:ring-purple-200 transition-all">
                      <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Symbol?"
        description="This action cannot be undone. Are you sure?"
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </div>
  );
}
