'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  BookOpen,
  Shield,
  TrendingUp,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!user || user.role !== 'ADMIN') return;
    const token = localStorage.getItem('token');

    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Admin Portal Access Restricted</h2>
        <p className="text-sm text-gray-500">Only authorized administrators can access this system.</p>
        <Link href="/login" className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl inline-block">
          Login as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-gray-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-200">
            System Administration
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">LearnHub Admin Dashboard</h1>
          <p className="text-rose-100 text-sm max-w-xl">
            Monitor platform health, activate/deactivate user accounts, audit course catalog, and review enrollments.
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-rose-600">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold bg-rose-50 px-2 py-0.5 rounded">Users</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalUsers || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Total Registered Users</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-blue-600">
            <UserCheck className="w-5 h-5" />
            <span className="text-xs font-bold bg-blue-50 px-2 py-0.5 rounded">Students</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalStudents || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Active Students</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold bg-purple-50 px-2 py-0.5 rounded">Instructors</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalInstructors || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Verified Instructors</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">Courses</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalCourses || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Published Courses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-amber-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">Enrollments</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalEnrollments || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Total Platform Enrollments</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Platform User Management</h2>
            <p className="text-xs text-gray-500 mt-1">Activate or deactivate student and instructor accounts.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Account Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-semibold">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-100 text-rose-800'
                            : u.role === 'INSTRUCTOR'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
