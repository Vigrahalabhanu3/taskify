'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage('Reset token is missing from the URL link.');
      return;
    }

    setErrorMessage(null);
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to reset password. Token may have expired.',
      );
    }
  };

  if (!token) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-4">
        <h3 className="text-sm font-bold">Invalid Reset Link</h3>
        <p className="text-xs text-rose-700">This password reset link is missing a valid security token.</p>
        <Link href="/forgot-password">
          <Button variant="outline" className="text-xs">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSuccess ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold">Password Reset Complete!</h3>
          <p className="text-xs text-emerald-700">Your password has been successfully updated. You can now log in.</p>
          <Link href="/login" className="block pt-2">
            <Button variant="primary" className="w-full">
              Proceed to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <Input
            label="New Password *"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm New Password *"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
            Set New Password
          </h1>
          <p className="text-indigo-100 text-base leading-relaxed">
            Choose a strong new password for your Taskify account. After saving, your old password will be invalidated.
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-500">Enter your new password below.</p>
          </div>

          <Suspense fallback={<div className="p-4 text-center text-xs text-slate-400">Loading token...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
