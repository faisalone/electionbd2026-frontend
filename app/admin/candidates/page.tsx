'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getAll, create, update, remove, getImageUrl } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, Users, Image as ImageIcon, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Candidate {
  id: number;
  name: string;
  name_en: string | null;
  party?: { 
    id: number; 
    name: string; 
    logo: string | null;
    symbol?: { id: number; symbol_name: string; image: string } | null;
    color: string;
  } | null;
  symbol?: { id: number; symbol_name: string; image: string } | null;
  seat: { id: number; name: string; district: { name: string } };
  age: number | null;
  education: string | null;
  experience: string | null;
  image: string;
  is_independent?: boolean;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export default function CandidatesPage() {
  const { token } = useAdmin();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [symbols, setSymbols] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });
  
  // Pagination and filtering
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    division_id: '',
    district_id: '',
    seat_id: '',
    party_id: '',
    is_independent: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    party_id: '',
    symbol_id: '',
    seat_id: '',
    age: '',
    education: '',
    experience: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCandidates();
      fetchParties();
      fetchSymbols();
      fetchSeats();
      fetchDistricts();
      fetchDivisions();
    }
  }, [token]);

  // Refetch when pagination or filters change
  useEffect(() => {
    if (token) {
      fetchCandidates();
    }
  }, [pagination.current_page, searchQuery, filters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        per_page: pagination.per_page.toString(),
        page: pagination.current_page.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filters.division_id) params.append('division_id', filters.division_id);
      if (filters.district_id) params.append('district_id', filters.district_id);
      if (filters.seat_id) params.append('seat_id', filters.seat_id);
      if (filters.party_id) params.append('party_id', filters.party_id);
      if (filters.is_independent) params.append('is_independent', '1');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/admin/candidates?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setCandidates(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      toast.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await getAll('parties', token!);
      if (response.success) {
        setParties(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch parties:', error);
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

  const fetchSeats = async () => {
    try {
      const response = await getAll('seats', token!);
      if (response.success) {
        setSeats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch seats:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await getAll('districts', token!);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await getAll('divisions', token!);
      if (response.success) {
        setDivisions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
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

  const handleOpenModal = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        name_en: candidate.name_en || '',
        party_id: candidate.party?.id?.toString() || '',
        symbol_id: candidate.symbol?.id?.toString() || '',
        seat_id: candidate.seat?.id?.toString() || '',
        age: candidate.age?.toString() || '',
        education: candidate.education || '',
        experience: candidate.experience || '',
      });
      setImagePreview(getImageUrl(candidate.image));
    } else {
      setEditingCandidate(null);
      setFormData({
        name: '',
        name_en: '',
        party_id: '',
        symbol_id: '',
        seat_id: '',
        age: '',
        education: '',
        experience: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: must have either party_id OR symbol_id
    if (!formData.party_id && !formData.symbol_id) {
      toast.error('Please select either a party or a symbol for independent candidate');
      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Send empty strings as empty to clear fields, not skip them
        submitData.append(key, value || '');
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingCandidate) {
        await update('candidates', editingCandidate.id, submitData, token!, true);
        toast.success('Candidate updated successfully!');
      } else {
        await create('candidates', submitData, token!, true);
        toast.success('Candidate created successfully!');
      }
      await fetchCandidates();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save candidate:', error);
      toast.error('Failed to save candidate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove('candidates', id, token!);
      await fetchCandidates();
      toast.success('Candidate deleted successfully!');
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      toast.error('Failed to delete candidate. Please try again.');
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
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Candidates
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              {pagination.total > 0 ? `${pagination.from}-${pagination.to} of ${pagination.total} candidates` : 'Manage election candidates'}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Candidate</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by candidate name (Bengali or English)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination({ ...pagination, current_page: 1 });
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters ? 'bg-[#C8102E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                <select
                  value={filters.division_id}
                  onChange={(e) => {
                    setFilters({ ...filters, division_id: e.target.value, district_id: '', seat_id: '' });
                    setPagination({ ...pagination, current_page: 1 });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 outline-none"
                >
                  <option value="">All Divisions</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>{div.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={filters.district_id}
                  onChange={(e) => {
                    setFilters({ ...filters, district_id: e.target.value, seat_id: '' });
                    setPagination({ ...pagination, current_page: 1 });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 outline-none"
                >
                  <option value="">All Districts</option>
                  {districts
                    .filter(d => !filters.division_id || d.division_id?.toString() === filters.division_id)
                    .map((dist) => (
                      <option key={dist.id} value={dist.id}>{dist.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seat</label>
                <select
                  value={filters.seat_id}
                  onChange={(e) => {
                    setFilters({ ...filters, seat_id: e.target.value });
                    setPagination({ ...pagination, current_page: 1 });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 outline-none"
                >
                  <option value="">All Seats</option>
                  {seats
                    .filter(s => !filters.district_id || s.district_id?.toString() === filters.district_id)
                    .map((seat) => (
                      <option key={seat.id} value={seat.id}>{seat.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
                <select
                  value={filters.party_id}
                  onChange={(e) => {
                    setFilters({ ...filters, party_id: e.target.value, is_independent: false });
                    setPagination({ ...pagination, current_page: 1 });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 outline-none"
                >
                  <option value="">All Parties</option>
                  {parties.map((party) => (
                    <option key={party.id} value={party.id}>{party.name}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="lg:col-span-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({ division_id: '', district_id: '', seat_id: '', party_id: '', is_independent: false });
                    setSearchQuery('');
                    setPagination({ ...pagination, current_page: 1 });
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200">
                {candidate.image ? (
                  <img src={getImageUrl(candidate.image)} alt={candidate.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Users size={48} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {/* Display symbol image or party logo */}
                  {candidate.symbol?.image ? (
                    <img 
                      src={getImageUrl(candidate.symbol.image)} 
                      alt={candidate.symbol.symbol_name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : candidate.party?.symbol?.image ? (
                    <img 
                      src={getImageUrl(candidate.party.symbol.image)} 
                      alt={candidate.party.symbol.symbol_name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : candidate.party?.logo ? (
                    <img 
                      src={getImageUrl(candidate.party.logo)} 
                      alt={candidate.party.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🏛️</span>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                    {candidate.name_en && <p className="text-sm text-gray-500">{candidate.name_en}</p>}
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Party:</span>
                    <span className="text-gray-600">{candidate.party?.name || 'Independent'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Seat:</span>
                    <span className="text-gray-600">{candidate.seat?.name}</span>
                  </div>
                  {candidate.age && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Age:</span>
                      <span className="text-gray-600">{candidate.age}</span>
                    </div>
                  )}
                  {candidate.education && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Education:</span>
                      <span className="text-gray-600">{candidate.education}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(candidate)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, id: candidate.id })}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6">
            <div className="text-sm text-gray-600">
              Showing {pagination.from} to {pagination.to} of {pagination.total} candidates
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                disabled={pagination.current_page === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.last_page <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current_page >= pagination.last_page - 2) {
                    pageNum = pagination.last_page - 4 + i;
                  } else {
                    pageNum = pagination.current_page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination({ ...pagination, current_page: pageNum })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        pagination.current_page === pageNum
                          ? 'bg-[#C8102E] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                disabled={pagination.current_page === pagination.last_page}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && candidates.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(v => v) 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first candidate'
              }
            </p>
            {!searchQuery && !Object.values(filters).some(v => v) && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A00D24] transition-all"
              >
                <Plus size={20} />
                Add First Candidate
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="flex flex-col gap-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all">
                      <ImageIcon size={20} />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (Bengali) <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Party {!formData.symbol_id && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={formData.party_id}
                      onChange={(e) => {
                        setFormData({ ...formData, party_id: e.target.value, symbol_id: e.target.value ? '' : formData.symbol_id });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                      disabled={!!formData.symbol_id}
                    >
                      <option value="">Independent Candidate</option>
                      {parties.map((party) => (
                        <option key={party.id} value={party.id}>
                          {party.name}
                        </option>
                      ))}
                    </select>
                    {!!formData.symbol_id && (
                      <p className="text-xs text-gray-500 mt-1">Clear symbol to select a party</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symbol (Independent Only) {!formData.party_id && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={formData.symbol_id}
                      onChange={(e) => {
                        setFormData({ ...formData, symbol_id: e.target.value, party_id: e.target.value ? '' : formData.party_id });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                      disabled={!!formData.party_id}
                    >
                      <option value="">None</option>
                      {symbols.map((symbol) => (
                        <option key={symbol.id} value={symbol.id}>
                          {symbol.symbol_name}
                        </option>
                      ))}
                    </select>
                    {!!formData.party_id && (
                      <p className="text-xs text-gray-500 mt-1">Party candidates use party symbol</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seat <span className="text-red-500">*</span></label>
                  <select
                    value={formData.seat_id}
                    onChange={(e) => setFormData({ ...formData, seat_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  >
                    <option value="">Select Seat</option>
                    {seats.map((seat) => (
                      <option key={seat.id} value={seat.id}>
                        {seat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      min="25"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
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

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
          onConfirm={() => {
            if (deleteConfirm.id) handleDelete(deleteConfirm.id);
          }}
          title="Delete Candidate"
          description="Are you sure you want to delete this candidate? This action cannot be undone."
        />
      </div>
    </ProtectedRoute>
  );
}
