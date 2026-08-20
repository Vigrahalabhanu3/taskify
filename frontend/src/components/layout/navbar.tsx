'use client';

import { useAuthStore } from '@/lib/auth-store';
import { LogOut, Bell, User as UserIcon, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <CheckSquare className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">Taskify</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500 leading-tight">{user?.email || 'user@email.com'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 border border-transparent hover:border-rose-200"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
