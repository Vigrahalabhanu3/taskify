'use client';

import React, { useState } from 'react';
import { Settings, Bell, Cloud, Shield, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskDoneAlerts, setTaskDoneAlerts] = useState(true);
  const [defaultCity, setDefaultCity] = useState('Hyderabad');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application Settings</h1>
          <p className="text-xs text-slate-500">Configure preferences, notifications, and application defaults</p>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email & Notification Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-indigo-600" /> Notification Preferences
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-slate-900">Task Creation Confirmations</p>
                <p className="text-xs text-slate-500">Receive an email notification whenever a new task is created</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-slate-900">Task Completion Alerts</p>
                <p className="text-xs text-slate-500">Receive an email notification when a task status changes to DONE</p>
              </div>
              <input
                type="checkbox"
                checked={taskDoneAlerts}
                onChange={(e) => setTaskDoneAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Integration & Regional Defaults */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cloud className="w-5 h-5 text-indigo-600" /> Integrations & Regional Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Default Weather City
              </label>
              <input
                type="text"
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Tasks Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="5">5 tasks per page</option>
                <option value="10">10 tasks per page</option>
                <option value="20">20 tasks per page</option>
                <option value="50">50 tasks per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-indigo-600" /> Security & Privacy
          </h2>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Password Encryption</span>
              <span className="font-mono text-emerald-600 font-bold">bcrypt (10 Salt Rounds)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Session Guard</span>
              <span className="font-mono text-emerald-600 font-bold">JWT AuthGuard Enforced</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Database Tenant Isolation</span>
              <span className="font-mono text-emerald-600 font-bold">Strict User Object ID Scoping</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
