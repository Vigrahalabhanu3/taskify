'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await apiClient.post('/auth/login', data);
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-5 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back! 👋</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to your Taskify account to manage your tasks</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-6 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full py-3 text-base" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
          Register here
        </Link>
      </p>
    </div>
  );
}
