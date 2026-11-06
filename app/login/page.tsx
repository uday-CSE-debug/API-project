'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (res.user.role === 'INSTRUCTOR') {
        router.push('/dashboard/instructor');
      } else {
        router.push('/dashboard/student');
      }
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-blue-50 text-blue-600 p-3 rounded-2xl mb-1">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-xs text-gray-500">Sign in to access your course dashboard and learning portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@learnhub.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span>Logging in...</span> : <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Quick Demo Credentials Buttons */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase text-center tracking-wider">Quick Demo Logins</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('student@learnhub.com')}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
            >
              Student
            </button>
            <button
              onClick={() => handleQuickLogin('instructor@learnhub.com')}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors"
            >
              Instructor
            </button>
            <button
              onClick={() => handleQuickLogin('admin@learnhub.com')}
              className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
