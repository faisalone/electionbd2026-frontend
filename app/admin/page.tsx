'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { 
  MapPin, 
  Users, 
  Award, 
  BarChart3,
  Newspaper,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { name: 'Divisions', value: '8', icon: MapPin, href: '/admin/divisions', color: 'bg-blue-500' },
  { name: 'Districts', value: '64', icon: MapPin, href: '/admin/districts', color: 'bg-green-500' },
  { name: 'Parties', value: '15+', icon: Award, href: '/admin/parties', color: 'bg-purple-500' },
  { name: 'Candidates', value: '300+', icon: Users, href: '/admin/candidates', color: 'bg-orange-500' },
  { name: 'Active Polls', value: '12', icon: BarChart3, href: '/admin/polls', color: 'bg-pink-500' },
  { name: 'News Articles', value: '50+', icon: Newspaper, href: '/admin/news', color: 'bg-indigo-500' },
];

const quickActions = [
  { name: 'Add Candidate', href: '/admin/candidates/create', icon: Users, color: 'bg-[#C8102E]' },
  { name: 'Create News', href: '/admin/news/create', icon: Newspaper, color: 'bg-blue-600' },
  { name: 'Manage Polls', href: '/admin/polls', icon: BarChart3, color: 'bg-green-600' },
  { name: 'Update Timeline', href: '/admin/timeline', icon: FileText, color: 'bg-purple-600' },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Activity className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-13">Welcome to the admin panel. Manage all election data from here.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                href={stat.href}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.name}</h3>
                      <p className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm font-semibold text-primary group-hover:text-primary-600 transition-colors">
                      <span>ব্যবস্থাপনা করুন</span>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon size={28} />
                      </div>
                      <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{action.name}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 text-gray-500">
              <Activity size={24} />
              <p>Activity tracking coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
