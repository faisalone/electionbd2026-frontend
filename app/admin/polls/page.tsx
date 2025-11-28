'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useAdmin } from '@/lib/admin/context';
import { getAll, getPollVotes, selectPollWinner, endPoll, create, update, remove } from '@/lib/admin/api';
import { useEffect, useState } from 'react';
import { Loader2, BarChart3, Trophy, Users, Clock, Eye, Plus, Edit2, Trash2, X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PollOption {
  id: number;
  text: string;
  color: string;
  vote_count: number;
  votes: number;
}

interface Poll {
  id: number;
  uid: string;
  question: string;
  end_date: string;
  status: string;
  total_votes: number;
  options: PollOption[];
  user: { name: string };
}

interface Vote {
  id: number;
  phone_number: string;
  is_winner: boolean;
  poll_option: PollOption;
  user: { name: string };
  created_at: string;
}

interface PollFormData {
  question: string;
  end_date: string;
  options: { id?: number; text: string; color: string }[];
  status?: 'pending' | 'active' | 'ended' | 'rejected';
}

export default function PollsPage() {
  const { token } = useAdmin();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Confirmation dialogs
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [endConfirm, setEndConfirm] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [winnerConfirm, setWinnerConfirm] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [approveConfirm, setApproveConfirm] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState<PollFormData>({
    question: '',
    end_date: '',
    options: [
      { text: '', color: '#3b82f6' },
      { text: '', color: '#10b981' },
    ],
  });

  useEffect(() => {
    if (token) {
      fetchPolls();
    }
  }, [token]);

  const fetchPolls = async () => {
    try {
      const response = await getAll('polls', token!);
      if (response.success) {
        setPolls(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVotes = async (poll: Poll) => {
    setSelectedPoll(poll);
    setShowVotesModal(true);
    setLoadingVotes(true);

    try {
      const response = await getPollVotes(poll.id, token!);
      if (response.success) {
        setVotes(response.votes);
      }
    } catch (error) {
      console.error('Failed to fetch votes:', error);
      toast.error('Failed to load votes');
    } finally {
      setLoadingVotes(false);
    }
  };

  const handleSelectWinner = async (pollId: number) => {
    try {
      const response = await selectPollWinner(pollId, 1, token!);
      if (response.success) {
        toast.success(`Winner selected: ${response.winner.user.name}`);
        await fetchPolls();
        if (selectedPoll?.id === pollId) {
          await handleViewVotes(selectedPoll);
        }
      }
    } catch (error) {
      console.error('Failed to select winner:', error);
      toast.error('Failed to select winner');
    }
  };

  const handleEndPoll = async (pollId: number) => {
    try {
      await endPoll(pollId, token!);
      await fetchPolls();
      toast.success('Poll ended successfully');
    } catch (error) {
      console.error('Failed to end poll:', error);
      toast.error('Failed to end poll');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPoll(null);
    setFormData({
      question: '',
      end_date: '',
      options: [
        { text: '', color: '#3b82f6' },
        { text: '', color: '#10b981' },
      ],
    });
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (poll: Poll) => {
    setEditingPoll(poll);

    let endDateLocal = '';
    if (poll.end_date) {
      const d = new Date(poll.end_date);
      const pad = (n: number) => String(n).padStart(2, '0');
      endDateLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`;
    }

    setFormData({
      question: poll.question,
      end_date: endDateLocal,
      options: poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        color: opt.color || '#3b82f6',
      })),
    });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingPoll(null);
  };

  const handleAddOption = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', color: colors[formData.options.length % colors.length] }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('Poll must have at least 2 options');
      return;
    }
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.options.some(o => !o.text.trim())) {
      toast.error('All options must have text');
      return;
    }

    setSaving(true);
    try {
      const submitData: any = {
        question: formData.question,
        end_date: formData.end_date || null,
        options: formData.options,
      };

      if (editingPoll) {
        // When editing, also send status if changed
        if (formData.status) {
          submitData.status = formData.status;
        }
        await update('polls', editingPoll.id, submitData, token!);
        toast.success('Poll updated successfully');
      } else {
        // New polls always start as pending
        submitData.status = 'pending';
        await create('polls', submitData, token!);
        toast.success('Poll created successfully');
      }
      
      handleCloseCreateModal();
      await fetchPolls();
    } catch (error: any) {
      console.error('Failed to save poll:', error);
      toast.error(error.response?.data?.message || 'Failed to save poll');
    } finally {
      setSaving(false);
    }
  };

  const handleApprovePoll = async (pollId: number) => {
    try {
      await update('polls', pollId, { status: 'active' }, token!);
      toast.success('Poll approved and activated');
      await fetchPolls();
    } catch (error) {
      console.error('Failed to approve poll:', error);
      toast.error('Failed to approve poll');
    }
  };

  const handleRejectPoll = async (pollId: number) => {
    try {
      await remove('polls', pollId, token!);
      toast.success('Poll rejected and deleted');
      await fetchPolls();
    } catch (error) {
      console.error('Failed to reject poll:', error);
      toast.error('Failed to reject poll');
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    try {
      await remove('polls', pollId, token!);
      toast.success('Poll deleted successfully');
      await fetchPolls();
    } catch (error) {
      console.error('Failed to delete poll:', error);
      toast.error('Failed to delete poll');
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-brrom-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Poll Management
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Manage polls, view votes, and select winners</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-linear-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create Poll</span>
          </button>
        </div>

        {/* Polls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.map((poll) => {
            const maxVotes = Math.max(...poll.options.map(o => o.vote_count || o.votes), 1);
            
            return (
              <div
                key={poll.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Poll Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        poll.status === 'active' ? 'bg-green-100 text-green-600' : 
                        poll.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                          poll.status === 'active' ? 'bg-green-100 text-green-600' : 
                          poll.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {poll.status === 'pending' ? 'Pending Approval' : poll.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{poll.total_votes}</div>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-4 text-lg">{poll.question}</h3>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    {poll.options.map((option) => {
                      const voteCount = option.vote_count || option.votes;
                      const percentage = poll.total_votes > 0 ? (voteCount / poll.total_votes) * 100 : 0;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">{option.text}</span>
                            <span className="text-gray-500">{voteCount} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: option.color 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {poll.user.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(poll.end_date).toLocaleDateString('en-GB')}
                    </div>
                  </div>

                  {/* Actions */}
                  {poll.status === 'pending' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenEditModal(poll)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setApproveConfirm({ isOpen: true, id: poll.id })}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 rounded-xl transition-all font-medium"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, id: poll.id })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all font-medium"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenEditModal(poll)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 rounded-xl transition-all font-medium"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleViewVotes(poll)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all font-medium"
                      >
                        <Eye size={16} />
                        <span>Votes</span>
                      </button>
                      <button
                        onClick={() => setWinnerConfirm({ isOpen: true, id: poll.id })}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-200 text-yellow-600 hover:bg-yellow-100 hover:border-yellow-300 rounded-xl transition-all font-medium"
                      >
                        <Trophy size={16} />
                        <span>Winner</span>
                      </button>
                      {poll.status === 'active' && (
                        <button
                          onClick={() => setEndConfirm({ isOpen: true, id: poll.id })}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300 rounded-xl transition-all font-medium"
                        >
                          <Clock size={16} />
                          <span>End</span>
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, id: poll.id })}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all font-medium"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Votes Modal */}
        {showVotesModal && selectedPoll && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Votes for: {selectedPoll.question}
                </h2>
                <button
                  onClick={() => setShowVotesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500"
                >
                  ×
                </button>
              </div>

              {loadingVotes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#C8102E]" size={48} />
                </div>
              ) : (
                <div className="space-y-3">
                  {votes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No votes yet
                    </div>
                  ) : (
                    votes.map((vote) => (
                      <div
                        key={vote.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          vote.is_winner
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {vote.is_winner && (
                              <Trophy className="text-yellow-600" size={24} />
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {vote.user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {vote.phone_number}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: vote.poll_option.color + '20',
                                color: vote.poll_option.color,
                              }}
                            >
                              {vote.poll_option.text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(vote.created_at).toLocaleString('en-GB')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create/Edit Poll Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPoll ? 'Edit Poll' : 'Create New Poll'}
                </h2>
                <button
                  onClick={handleCloseCreateModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="আপনার প্রশ্ন লিখুন"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
                    required
                  />
                </div>

                {editingPoll && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || editingPoll.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="ended">Ended</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date {!editingPoll && <span className="text-gray-400">(Optional - can be set later)</span>}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="color"
                          value={option.color}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index].color = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          className="w-12 h-12 rounded-xl border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index].text = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-linear-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingPoll ? 'Update Poll' : 'Create Poll'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
          onConfirm={() => deleteConfirm.id && handleDeletePoll(deleteConfirm.id)}
          title="Delete Poll"
          description="Are you sure you want to delete this poll? This action cannot be undone."
          confirmText="Delete"
        />

        <ConfirmDialog
          isOpen={endConfirm.isOpen}
          onClose={() => setEndConfirm({ isOpen: false, id: null })}
          onConfirm={() => endConfirm.id && handleEndPoll(endConfirm.id)}
          title="End Poll"
          description="Are you sure you want to end this poll? This action cannot be undone."
          confirmText="End Poll"
        />

        <ConfirmDialog
          isOpen={winnerConfirm.isOpen}
          onClose={() => setWinnerConfirm({ isOpen: false, id: null })}
          onConfirm={() => winnerConfirm.id && handleSelectWinner(winnerConfirm.id)}
          title="Select Winner"
          description="Select a random winner from this poll?"
          confirmText="Select Winner"
        />

        <ConfirmDialog
          isOpen={approveConfirm.isOpen}
          onClose={() => setApproveConfirm({ isOpen: false, id: null })}
          onConfirm={() => approveConfirm.id && handleApprovePoll(approveConfirm.id)}
          title="Approve Poll"
          description="Approve this poll and make it active?"
          confirmText="Approve"
        />
      </div>
    </ProtectedRoute>
  );
}
