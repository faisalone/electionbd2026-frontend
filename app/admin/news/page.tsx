'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAdmin } from '@/lib/admin/context';
import { getAll, create, update, remove, getImageUrl } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, Newspaper, Image as ImageIcon, Eye, XCircle, ExternalLink, Calendar, Clock } from 'lucide-react';

interface News {
  id: number;
  uid: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  created_at: string;
  category: string;
  is_ai_generated: boolean;
  status: string;
  source_url?: string | null;
}

export default function NewsPage() {
  const { token } = useAdmin();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'নির্বাচন',
    source_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNews();
    }
  }, [token]);

  const fetchNews = async () => {
    try {
      const response = await getAll('news', token!);
      if (response.success) {
        setNews(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
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

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary,
        content: newsItem.content,
        category: newsItem.category,
        source_url: '',
      });
      setImagePreview(getImageUrl(newsItem.image));
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'নির্বাচন',
        source_url: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingNews) {
        await update('news', editingNews.id, submitData, token!, true);
      } else {
        await create('news', submitData, token!, true);
      }
      await fetchNews();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save news:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      await remove('news', id, token!);
      await fetchNews();
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  const handleViewNews = (newsItem: News) => {
    setViewingNews(newsItem);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingNews(null);
  };

  const handleRejectNews = async (id: number) => {
    if (!confirm('Are you sure you want to reject this news article?')) return;

    try {
      const formData = new FormData();
      formData.append('status', 'rejected');
      await update('news', id, formData, token!, true);
      await fetchNews();
      handleCloseViewModal();
    } catch (error) {
      console.error('Failed to reject news:', error);
    }
  };

  const parseSources = (sourceUrl: string | null | undefined) => {
    if (!sourceUrl) return [];
    try {
      return JSON.parse(sourceUrl);
    } catch (error) {
      return [];
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
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
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Newspaper className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                News Management
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Manage news articles</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add News</span>
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((newsItem) => (
            <div
              key={newsItem.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                {/* Header: Category + DateTime */}
                <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 shrink-0">
                    <Newspaper className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{newsItem.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 pt-1 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateTime(newsItem.created_at).date}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(newsItem.created_at).time}</span>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="mb-4">
                  <div className="relative h-40 bg-gray-50 rounded-2xl overflow-hidden">
                    {newsItem.image !== '/news-placeholder.svg' ? (
                      <img
                        src={getImageUrl(newsItem.image)}
                        alt={newsItem.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Newspaper size={48} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
                  {newsItem.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {newsItem.summary}
                </p>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewNews(newsItem)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 rounded-xl transition-all font-medium"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleOpenModal(newsItem)}
                    className="flex items-center justify-center px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem.id)}
                    className="flex items-center justify-center px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {showViewModal && viewingNews && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">News Details</h2>
                <button onClick={handleCloseViewModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Badge */}
                {viewingNews.status && (
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      viewingNews.status === 'published' ? 'bg-green-100 text-green-700' :
                      viewingNews.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Status: {viewingNews.status}
                    </span>
                    {viewingNews.is_ai_generated && (
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 text-purple-700">
                        AI Generated
                      </span>
                    )}
                  </div>
                )}

                {/* Image */}
                {viewingNews.image && viewingNews.image !== '/news-placeholder.svg' && (
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img
                      src={getImageUrl(viewingNews.image)}
                      alt={viewingNews.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category & DateTime */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Newspaper className="w-4 h-4" />
                    <span className="font-semibold">{viewingNews.category}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(viewingNews.created_at).date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDateTime(viewingNews.created_at).time}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {viewingNews.title}
                  </h3>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">সারসংক্ষেপ</h4>
                  <p className="text-gray-700 leading-relaxed">{viewingNews.summary}</p>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">বিস্তারিত</h4>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {viewingNews.content}
                  </div>
                </div>

                {/* Sources */}
                {viewingNews.source_url && parseSources(viewingNews.source_url).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Sources ({parseSources(viewingNews.source_url).length})
                    </h4>
                    <div className="space-y-3">
                      {parseSources(viewingNews.source_url).map((source: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-gray-900 text-sm flex-1">{source.title}</h5>
                            <span className="text-xs text-gray-500 shrink-0">Source {index + 1}</span>
                          </div>
                          {source.link && (
                            <a 
                              href={source.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 mb-2"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {source.source || source.link}
                            </a>
                          )}
                          {source.published_at && (
                            <p className="text-xs text-gray-500 mb-2">Published: {source.published_at}</p>
                          )}
                          {source.excerpt && (
                            <p className="text-xs text-gray-600 leading-relaxed">{source.excerpt}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t sticky bottom-0 bg-white">
                  {viewingNews.status !== 'rejected' && (
                    <button
                      onClick={() => handleRejectNews(viewingNews.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 py-3 rounded-xl transition-all font-semibold"
                    >
                      <XCircle size={20} />
                      Reject News
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleOpenModal(viewingNews);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 py-3 rounded-xl transition-all font-semibold"
                  >
                    <Edit2 size={20} />
                    Edit News
                  </button>
                  <button
                    onClick={handleCloseViewModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNews ? 'Edit News' : 'Add News'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="flex flex-col gap-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all">
                      <ImageIcon size={20} />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 outline-none transition-all"
                    >
                      <option value="নির্বাচন">নির্বাচন</option>
                      <option value="রাজনীতি">রাজনীতি</option>
                      <option value="বিশ্লেষণ">বিশ্লেষণ</option>
                      <option value="মতামত">মতামত</option>
                    </select>
                  </div>
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
