'use client';

import { useState, useEffect, useRef } from 'react';
import { useMarketAuth } from '@/lib/market-auth-context';
import { Save, Loader2, Camera, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/marketplace`;

export default function SettingsPage() {
  const { user } = useMarketAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    username: '',
    bio: '',
    location: '',
    avatar: '',
    status: null as string | null,
  });
  const [initialProfile, setInitialProfile] = useState(profile);
  const [profileExists, setProfileExists] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Track if there are changes
  const hasChanges = 
    profile.name !== initialProfile.name ||
    profile.username !== initialProfile.username ||
    profile.bio !== initialProfile.bio ||
    profile.location !== initialProfile.location ||
    avatarFile !== null;

  // Load profile data
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        console.log('API Response:', data); // DEBUG
        if (data.success) {
          console.log('Profile data:', data.data.profile); // DEBUG
          // Ensure all fields have fallback values
          const profileData = data.data.profile;
          const loadedProfile = {
            name: profileData.name ?? '',
            phone: profileData.phone ?? '',
            username: profileData.username ?? '',
            bio: profileData.bio ?? '',
            location: profileData.location ?? '',
            avatar: profileData.avatar ?? '',
            status: profileData.status ?? null,
          };
          setProfile(loadedProfile);
          setInitialProfile(loadedProfile);
          setProfileExists(data.data.exists);
        }
      } catch (error) {
        console.error('Load error:', error);
        toast.error('প্রোফাইল লোড করতে সমস্যা হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    // Add /storage/ prefix if not present
    const path = url.startsWith('/') ? url : `/storage/${url}`;
    return `${API_BASE_URL.replace('/api/v1', '')}${path}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name.trim()) {
      toast.error('নাম প্রয়োজন');
      return;
    }

    if (!profile.username.trim()) {
      toast.error('ইউজারনেম প্রয়োজন');
      return;
    }
    
    setSaving(true);
    
    try {
      const token = localStorage.getItem('market_token');
      const formData = new FormData();
      
      formData.append('name', profile.name);
      formData.append('username', profile.username);
      formData.append('bio', profile.bio ?? '');
      formData.append('location', profile.location ?? '');
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const savedProfile = data.data.profile;
        setProfile(savedProfile);
        setInitialProfile(savedProfile);
        setProfileExists(true);
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        toast.success(data.message);
      } else {
        toast.error(data.message || 'সমস্যা হয়েছে');
      }
      
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <>
      {/* Header with Save Button */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">প্রোফাইল সেটিংস</h1>
          <p className="text-sm sm:text-base text-gray-600">আপনার ক্রিয়েটর প্রোফাইল পরিচালনা করুন</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !hasChanges}
          className="shrink-0 bg-linear-to-r from-[#C8102E] to-[#A00D24] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-[#A00D24] hover:to-[#C8102E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>সেভ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>সেভ করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Status Alerts */}
      {!profileExists && (
        <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-linear-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">ক্রিয়েটর হিসেবে যোগ দিন</h3>
              <p className="text-xs sm:text-sm text-blue-800">মার্কেটপ্লেসে ডিজাইন বিক্রয় করতে আপনার প্রোফাইল সম্পূর্ণ করুন</p>
            </div>
          </div>
        </div>
      )}

      {profile.status === 'pending' && (
        <div className="mb-6 rounded-2xl border-2 border-yellow-200 bg-linear-to-r from-yellow-50 to-yellow-100 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shrink-0 animate-pulse">
              <Loader2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm sm:text-base">অনুমোদন অপেক্ষমাণ</h3>
              <p className="text-xs sm:text-sm text-yellow-800">আপনার ক্রিয়েটর প্রোফাইল অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে</p>
            </div>
          </div>
        </div>
      )}

      {profile.status === 'suspended' && (
        <div className="mb-6 rounded-2xl border-2 border-red-200 bg-linear-to-r from-red-50 to-red-100 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xl">⚠</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">প্রোফাইল সাসপেন্ড</h3>
              <p className="text-xs sm:text-sm text-red-800">আপনার প্রোফাইল বর্তমানে সাসপেন্ড করা হয়েছে</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Avatar (Desktop) / Top Section (Mobile) */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
              <div className="bg-linear-to-r from-[#C8102E]/5 to-[#C8102E]/10 px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8102E]" />
                  প্রোফাইল ছবি
                </h2>
              </div>
              <div className="p-4 sm:p-6 flex flex-col items-center">
                <div className="relative group">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-[#C8102E]/20 shadow-lg">
                    {profile.avatar && getImageUrl(profile.avatar) ? (
                      <Image
                        src={getImageUrl(profile.avatar)}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized={profile.avatar.startsWith('data:')}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <User className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#C8102E] rounded-full flex items-center justify-center shadow-lg hover:bg-[#A00D24] transition-all hover:scale-110"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  JPG, PNG ফরম্যাট (সর্বোচ্চ ২MB)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-linear-to-r from-[#C8102E]/5 to-[#C8102E]/10 px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8102E]" />
                  ব্যক্তিগত তথ্য
                </h2>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                {/* Phone (Read-only) - Modern Style */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                    ফোন নম্বর
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile.phone || ''}
                      disabled
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-sm sm:text-base font-medium cursor-not-allowed"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 font-medium hidden sm:block">
                      পরিবর্তনযোগ্য নয়
                    </div>
                  </div>
                </div>

                {/* Name - Modern Style */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    নাম <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all hover:border-gray-300"
                  />
                </div>

                {/* Username - Modern Style */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    ইউজারনেম <span className="text-[#C8102E]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm sm:text-base">@</span>
                    <input
                      type="text"
                      value={profile.username || ''}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      placeholder="username_here"
                      className="w-full pl-9 sm:pl-10 pr-4 sm:pr-5 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all hover:border-gray-300"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং আন্ডারস্কোর ব্যবহার করুন
                  </p>
                </div>

                {/* Location - Modern Style */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">ঠিকানা</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="ঢাকা, বাংলাদেশ"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-all hover:border-gray-300"
                  />
                </div>

                {/* Bio - Modern Style */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">বায়ো</label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="আপনার সম্পর্কে কিছু লিখুন... আপনি কী ধরনের ডিজাইন করেন, আপনার অভিজ্ঞতা ইত্যাদি"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none transition-all hover:border-gray-300"
                  />
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs text-gray-400 font-medium">
                    {profile.bio?.length || 0} / 1000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}