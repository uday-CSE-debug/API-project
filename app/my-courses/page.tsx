'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProgressBar from '@/components/ProgressBar';
import { BookOpen, PlayCircle, Clock, Award, ArrowRight } from 'lucide-react';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');

    Promise.all([
      fetch(`/api/enrollments/student/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch('/api/progress', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([enrollData, progressData]) => {
        if (enrollData.success) setEnrollments(enrollData.data);
        if (progressData.success) setProgressList(progressData.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Please log in to view your enrolled courses</h2>
        <Link href="/login" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl inline-block">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">My Learning Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">All courses you are currently enrolled in.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 space-y-4">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900">No Enrolled Courses</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You haven't enrolled in any course yet. Explore our course catalog to get started.
          </p>
          <Link
            href="/courses"
            className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md inline-block"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => {
            const prog = progressList.find((p) => p.courseId === e.courseId) || {
              completionPercentage: 0,
              completedLessons: 0,
              totalLessons: e.course?.lessons?.length || 0,
            };

            return (
              <div
                key={e.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <img
                    src={e.course?.thumbnail}
                    alt={e.course?.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {e.course?.category}
                    </span>
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2">{e.course?.title}</h3>

                    <ProgressBar percentage={prog.completionPercentage} size="md" color="blue" />
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">
                    {prog.completedLessons} / {prog.totalLessons || e.course?.lessons?.length || 0} Lessons
                  </span>
                  <Link
                    href={`/courses/${e.courseId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Continue</span>
                    <PlayCircle className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
