'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Calendar, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Please log in to view profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {user.role} Account
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">Account Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="text-xs text-gray-400 font-semibold">User Role</div>
              <div className="font-bold text-gray-800">{user.role}</div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="text-xs text-gray-400 font-semibold">Account Status</div>
              <div className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{user.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
