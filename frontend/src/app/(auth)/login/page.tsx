import { LoginForm } from '@/components/auth/login-form';
import { CheckSquare, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left split banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Taskify</span>
        </div>

        <div className="my-auto max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Task Management Simplified</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight mb-4">
            Stay organized. <br />
            Get things done.
          </h1>
          <p className="text-indigo-100 text-base leading-relaxed mb-8">
            Manage your tasks, track progress with real-time weather intelligence, and achieve more every day.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10">
                <ShieldCheck className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="text-sm font-medium text-indigo-100">Private, JWT-authenticated task isolation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10">
                <Zap className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-sm font-medium text-indigo-100">Cloudinary attachments & OpenWeather integration</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-indigo-200 z-10">
          &copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.
        </div>
      </div>

      {/* Right login form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <LoginForm />
      </div>
    </main>
  );
}
