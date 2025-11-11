'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin/context';
import { Map, Plus, Edit2, Trash2, X } from 'lucide-react';
import { getAll, create, update, remove } from '@/lib/admin/api';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

type Tab = 'divisions' | 'districts' | 'seats';

interface Division {
  id: number;
  name: string;
  name_en: string;
  districts_count?: number;
  seats_count?: number;
}

interface District {
  id: number;
  name: string;
  name_en: string;
  division_id: number;
  division?: Division;
  seats_count?: number;
}

interface Seat {
  id: number;
  name: string;
  name_en: string;
  area?: string;
  district_id: number;
  district?: District;
}

interface FormData {
  name: string;
  name_en: string;
  division_id?: number;
  district_id?: number;
  area?: string;
}

interface DeleteConfirm {
  isOpen: boolean;
  id: number | null;
  type: Tab;
}

export default function LocationsPage() {
  const { token } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('divisions');
  const [divisionsData, setDivisionsData] = useState<Division[]>([]);
  const [districtsData, setDistrictsData] = useState<District[]>([]);
  const [seatsData, setSeatsData] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Filtering states
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    name_en: '',
    division_id: undefined,
    district_id: undefined,
    area: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm>({
    isOpen: false,
    id: null,
    type: 'divisions',
  });

  useEffect(() => {
    loadData();
  }, [activeTab, token]);

  // Always load divisions for dropdowns
  useEffect(() => {
    if (token && activeTab !== 'divisions' && divisionsData.length === 0) {
      loadDivisions();
    }
  }, [activeTab, token]);

  const loadDivisions = async () => {
    if (!token) return;
    try {
      const data = await getAll('divisions', token);
      setDivisionsData(data.data || []);
    } catch (error) {
      console.error('Failed to load divisions:', error);
    }
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (activeTab === 'divisions') {
        const data = await getAll('divisions', token);
        setDivisionsData(data.data || []);
      } else if (activeTab === 'districts') {
        const data = await getAll('districts', token);
        setDistrictsData(data.data || []);
      } else if (activeTab === 'seats') {
        const data = await getAll('seats', token);
        setSeatsData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Division | District | Seat) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        name_en: item.name_en,
        division_id: 'division_id' in item ? item.division_id : undefined,
        district_id: 'district_id' in item ? item.district_id : undefined,
        area: 'area' in item ? item.area || '' : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        name_en: '',
        division_id: undefined,
        district_id: undefined,
        area: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      name_en: '',
      division_id: undefined,
      district_id: undefined,
      area: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const endpoint = activeTab;
      const payload: any = {
        name: formData.name,
        name_en: formData.name_en,
      };

      if (activeTab === 'districts') {
        if (!formData.division_id) {
          toast.error('Please select a division');
          return;
        }
        payload.division_id = formData.division_id;
      } else if (activeTab === 'seats') {
        if (!formData.district_id) {
          toast.error('Please select a district');
          return;
        }
        payload.district_id = formData.district_id;
        if (formData.area) {
          payload.area = formData.area;
        }
      }

      if (editingId) {
        await update(endpoint, editingId, payload, token);
        toast.success(`${activeTab.slice(0, -1)} updated successfully`);
      } else {
        await create(endpoint, payload, token);
        toast.success(`${activeTab.slice(0, -1)} created successfully`);
      }

      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error('Failed to save:', error);
      toast.error(error.response?.data?.message || 'Failed to save data');
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteConfirm.id) return;

    try {
      await remove(deleteConfirm.type, deleteConfirm.id, token);
      toast.success(`${deleteConfirm.type.slice(0, -1)} deleted successfully`);
      setDeleteConfirm({ isOpen: false, id: null, type: 'divisions' });
      loadData();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      toast.error(error.response?.data?.message || 'Failed to delete data');
    }
  };

  // Load districts when division is selected for seats
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  
  useEffect(() => {
    if (activeTab === 'seats' && formData.division_id && token) {
      const fetchDistricts = async () => {
        try {
          const data = await getAll(`districts?division_id=${formData.division_id}`, token);
          setAvailableDistricts(data.data || []);
        } catch (error) {
          console.error('Failed to load districts:', error);
        }
      };
      fetchDistricts();
    }
  }, [formData.division_id, activeTab, token]);

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Map className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Locations
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Manage divisions, districts, and parliamentary seats</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add {activeTab.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-2 mb-6 inline-flex gap-2">
        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'divisions'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-white/50'
          }`}
        >
          Divisions
        </button>
        <button
          onClick={() => setActiveTab('districts')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'districts'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-white/50'
          }`}
        >
          Districts
        </button>
        <button
          onClick={() => setActiveTab('seats')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'seats'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-white/50'
          }`}
        >
          Seats
        </button>
      </div>

      {/* Content */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Breadcrumb / Filter Info */}
            {(selectedDivisionId || selectedDistrictId) && (
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600">Filtering:</span>
                {selectedDivisionId && (
                  <button
                    onClick={() => {
                      setSelectedDivisionId(null);
                      setSelectedDistrictId(null);
                      setActiveTab('divisions');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    <span>{divisionsData.find(d => d.id === selectedDivisionId)?.name}</span>
                    <X size={14} />
                  </button>
                )}
                {selectedDistrictId && (
                  <button
                    onClick={() => {
                      setSelectedDistrictId(null);
                      setActiveTab('districts');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    <span>{districtsData.find(d => d.id === selectedDistrictId)?.name}</span>
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {activeTab === 'divisions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {divisionsData.map((division) => (
                  <div
                    key={division.id}
                    onClick={() => {
                      setSelectedDivisionId(division.id);
                      setActiveTab('districts');
                    }}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                          {division.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                            {division.name}
                          </h3>
                          <p className="text-sm text-gray-500">{division.name_en}</p>
                        </div>
                      </div>
                      
                      {(division.districts_count || division.seats_count) && (
                        <div className="mb-4 grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">জেলা</p>
                            <p className="text-lg font-bold text-blue-600">{division.districts_count || 0}</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">আসন</p>
                            <p className="text-lg font-bold text-green-600">{division.seats_count || 0}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(division);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                        >
                          <Edit2 size={16} />
                          <span>সম্পাদনা</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ isOpen: true, id: division.id, type: 'divisions' });
                          }}
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

            {activeTab === 'districts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {districtsData
                  .filter(district => !selectedDivisionId || district.division_id === selectedDivisionId)
                  .map((district) => (
                  <div
                    key={district.id}
                    onClick={() => {
                      setSelectedDistrictId(district.id);
                      setActiveTab('seats');
                    }}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                          {district.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                            {district.name}
                          </h3>
                          <p className="text-sm text-gray-500">{district.name_en}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 space-y-2">
                        {district.division && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-500">বিভাগ:</span>
                            <span className="font-semibold">{district.division.name}</span>
                          </div>
                        )}
                        {district.seats_count && (
                          <div className="bg-green-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">মোট আসন</p>
                            <p className="text-lg font-bold text-green-600">{district.seats_count}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(district);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                        >
                          <Edit2 size={16} />
                          <span>সম্পাদনা</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ isOpen: true, id: district.id, type: 'districts' });
                          }}
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

            {activeTab === 'seats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seatsData
                  .filter(seat => !selectedDistrictId || seat.district_id === selectedDistrictId)
                  .map((seat) => (
                  <div
                    key={seat.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                          {seat.name.split('-')[1] || seat.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                            {seat.name}
                          </h3>
                          <p className="text-sm text-gray-500">{seat.name_en}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 space-y-2">
                        {seat.area && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-500">এলাকা:</span>
                            <span className="font-semibold">{seat.area}</span>
                          </div>
                        )}
                        {seat.district && (
                          <div className="bg-purple-50 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">জেলা</p>
                            <p className="text-sm font-bold text-purple-600">{seat.district.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleOpenModal(seat)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                        >
                          <Edit2 size={16} />
                          <span>সম্পাদনা</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: seat.id, type: 'seats' })}
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
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Division Dropdown for Districts */}
              {activeTab === 'districts' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.division_id || ''}
                    onChange={(e) => setFormData({ ...formData, division_id: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                    required
                  >
                    <option value="">Select Division</option>
                    {divisionsData.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.name} ({div.name_en})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Division & District Dropdown for Seats */}
              {activeTab === 'seats' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.division_id || ''}
                      onChange={(e) => setFormData({ ...formData, division_id: Number(e.target.value), district_id: undefined })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                      required
                    >
                      <option value="">Select Division</option>
                      {divisionsData.map((div) => (
                        <option key={div.id} value={div.id}>
                          {div.name} ({div.name_en})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.district_id || ''}
                      onChange={(e) => setFormData({ ...formData, district_id: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                      required
                      disabled={!formData.division_id}
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name} ({dist.name_en})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Name Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Bangla) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                  required
                />
              </div>

              {/* Area field for Seats */}
              {activeTab === 'seats' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.area || ''}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50"
                  />
                </div>
              )}

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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
        title={`Delete ${deleteConfirm.type.slice(0, -1)}?`}
        description="This action cannot be undone. Are you sure?"
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, type: 'divisions' })}
      />
    </div>
  );
}
