'use client';

import React from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useTaskStatsQuery } from '@/hooks/use-tasks';
import { User, Mail, Shield, CheckCircle, Clock, Calendar, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: stats } = useTaskStatsQuery();

  const total = stats?.total || 0;
  const done = stats?.done || 0;
  const inProgress = stats?.inProgress || 0;

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.name || 'User Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Verified Account
              </span>
            </div>
            <p className="text-sm text-indigo-100 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 opacity-80" />
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</span>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{completionRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</span>
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{done}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{inProgress}</p>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="w-5 h-5 text-indigo-600" /> Account Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {user?.name || 'N/A'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {user?.email || 'N/A'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">User Identifier</label>
            <p className="font-mono text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 truncate">
              {user?.id || 'N/A'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Security Authentication</label>
            <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" /> JWT Bearer Authorization Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
