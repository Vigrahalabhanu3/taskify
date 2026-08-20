'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useTasksQuery } from '@/hooks/use-tasks';
import {
  LogOut,
  Bell,
  CheckSquare,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  Mail,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: tasksResponse } = useTasksQuery({ limit: 10 });
  const tasks = tasksResponse?.data || [];

  // Close notifications popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Dynamically generate recent email notification activity items
  const emailNotifications = [
    ...(user?.email
      ? [
          {
            id: 'notif-pwd-reset',
            type: 'PASSWORD_RESET',
            title: 'Password Reset Email Dispatched',
            subject: '[Taskify] Reset Your Password',
            recipient: user.email,
            timestamp: new Date().toISOString(),
            read: false,
            link: '/profile',
          },
        ]
      : []),
    ...tasks.map((task) => {
      const isDone = task.status === 'DONE';
      return {
        id: `notif-${task._id}`,
        type: isDone ? 'TASK_COMPLETED' : 'TASK_CREATED',
        title: isDone ? `Task Completed Email Sent` : `Task Creation Email Sent`,
        subject: isDone
          ? `[Taskify] Task Completed: "${task.title}" 🎉`
          : `[Taskify] Task Created: "${task.title}"`,
        recipient: user?.email || 'user@example.com',
        timestamp: isDone ? task.updatedAt : task.createdAt,
        read: isDone,
        link: `/tasks/${task._id}`,
      };
    }),
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Taskify</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 relative" ref={popoverRef}>
          {/* Notification Bell Button */}
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className={cn(
              'relative p-2 rounded-xl transition cursor-pointer',
              notificationsOpen
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50',
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Email Notifications</h3>
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {emailNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No recent email notifications.
                  </div>
                ) : (
                  emailNotifications.map((notif) => (
                    <Link
                      key={notif.id}
                      href={notif.link}
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-4 hover:bg-slate-50 transition group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-xl flex-shrink-0 mt-0.5',
                            notif.type === 'TASK_COMPLETED'
                              ? 'bg-emerald-100/70 text-emerald-600'
                              : notif.type === 'PASSWORD_RESET'
                              ? 'bg-amber-100/70 text-amber-600'
                              : 'bg-indigo-100/70 text-indigo-600',
                          )}
                        >
                          {notif.type === 'TASK_COMPLETED' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : notif.type === 'PASSWORD_RESET' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" />
                              {formatDate(notif.timestamp, 'hh:mm a')}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-700 truncate">{notif.subject}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">To: {notif.recipient}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
                Sent via Taskify Real SMTP Engine
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</div>
              <div className="text-xs text-slate-500 leading-tight">{user?.email || 'user@email.com'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 border border-transparent hover:border-rose-200 cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-slate-900/40 backdrop-blur-xs flex flex-col">
          <div className="bg-white border-b border-slate-200 p-4 shadow-xl space-y-3">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-base flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'user@email.com'}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/tasks' && pathname.startsWith('/tasks'));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm hover:bg-rose-100 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
