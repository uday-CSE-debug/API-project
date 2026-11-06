'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Trash2, BookOpen, ArrowLeft } from 'lucide-react';

export default function AdminCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course as admin?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Admin access required</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <h1 className="text-2xl font-black text-gray-900">Admin Course Moderation</h1>
        {loading ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-semibold">
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="py-4 px-4 font-bold text-gray-900">{c.title}</td>
                    <td className="py-4 px-4 text-gray-600">{c.instructor?.name}</td>
                    <td className="py-4 px-4 text-gray-600">{c.category}</td>
                    <td className="py-4 px-4 text-gray-900">${c.price}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold"
                      >
                        Delete Course
                      </button>
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
