import { RegisterForm } from '@/components/auth/register-form';
import { CheckSquare, Sparkles, UserPlus, Shield } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left split banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Taskify</span>
        </div>

        <div className="my-auto max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create Your Free Account</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight mb-4">
            Join Taskify <br />
            Today!
          </h1>
          <p className="text-purple-100 text-base leading-relaxed mb-8">
            Create your account and start managing your tasks efficiently with secure cloud storage and automated email updates.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10">
                <UserPlus className="w-5 h-5 text-purple-200" />
              </div>
              <span className="text-sm font-medium text-purple-100">Instant registration with email confirmation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10">
                <Shield className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="text-sm font-medium text-purple-100">Bcrypt password encryption & JWT authorization</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-purple-200 z-10">
          &copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <RegisterForm />
      </div>
    </main>
  );
}
