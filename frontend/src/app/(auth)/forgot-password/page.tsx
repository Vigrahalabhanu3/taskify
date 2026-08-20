'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to request password reset. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-black tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
              ✓
            </div>
            Taskify
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Account Recovery
          </h1>
          <p className="text-indigo-100 text-base leading-relaxed">
            Forgot your password? No worries. Enter your registered email address and we will send you secure password reset instructions.
          </p>
        </div>

        <div className="relative z-10 text-xs text-indigo-200">
          &copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
          <div className="space-y-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h2>
            <p className="text-xs text-slate-500">Enter your email address to receive password reset instructions.</p>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <h3 className="text-sm font-bold">Reset Email Dispatched</h3>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If an account with that email exists, we have sent instructions to reset your password. Please check your inbox.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full text-xs">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <Input
                label="Email Address *"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
