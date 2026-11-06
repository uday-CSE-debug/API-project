'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProgressBar from '@/components/ProgressBar';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  PlayCircle,
  TrendingUp,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react';

export default function StudentDashboardPage() {
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
        <h2 className="text-2xl font-bold">Please log in to view student dashboard</h2>
        <Link href="/login" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl inline-block">
          Login
        </Link>
      </div>
    );
  }

  const totalEnrolled = enrollments.length;
  const completedCourses = progressList.filter((p) => p.completionPercentage === 100).length;
  const inProgressCourses = totalEnrolled - completedCourses;

  const avgQuizScore =
    progressList.length > 0
      ? Math.round(progressList.reduce((acc, p) => acc + (p.quizScore || 0), 0) / progressList.length)
      : 0;

  const overallProgressPercent =
    progressList.length > 0
      ? Math.round(progressList.reduce((acc, p) => acc + p.completionPercentage, 0) / progressList.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-200">
            Student Learning Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Welcome back, {user.name}!</h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Track your course completion, complete pending assignments, and attempt quizzes to earn certificates.
          </p>
        </div>

        <Link
          href="/courses"
          className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-md transition-all hover:scale-105 shrink-0"
        >
          Explore New Courses
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase bg-blue-50 px-2 py-0.5 rounded">Enrolled</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalEnrolled}</div>
          <div className="text-xs text-gray-500 font-medium">Total Courses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase bg-amber-50 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{inProgressCourses}</div>
          <div className="text-xs text-gray-500 font-medium">In Progress</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded">Done</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{completedCourses}</div>
          <div className="text-xs text-gray-500 font-medium">Completed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase bg-purple-50 px-2 py-0.5 rounded">Quiz Avg</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{avgQuizScore}%</div>
          <div className="text-xs text-gray-500 font-medium">Average Quiz Score</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-indigo-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold uppercase bg-indigo-50 px-2 py-0.5 rounded">Overall</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{overallProgressPercent}%</div>
          <div className="text-xs text-gray-500 font-medium">Overall Progress</div>
        </div>
      </div>

      {/* Main Enrolled Courses & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Continue Learning</h2>
            <Link href="/my-courses" className="text-xs font-bold text-blue-600 hover:underline">
              View All Enrolled ({totalEnrolled})
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center space-y-4 border border-gray-100">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">No Enrolled Courses Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You haven't enrolled in any courses yet. Browse our catalog and start learning!
              </p>
              <Link
                href="/courses"
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((e) => {
                const prog = progressList.find((p) => p.courseId === e.courseId) || {
                  completionPercentage: 0,
                  completedLessons: 0,
                  totalLessons: e.course?.lessons?.length || 0,
                };

                return (
                  <div
                    key={e.id}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-center"
                  >
                    <img
                      src={e.course?.thumbnail}
                      alt={e.course?.title}
                      className="w-full sm:w-40 h-28 object-cover rounded-2xl shadow-xs"
                    />

                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {e.course?.category}
                          </span>
                          <h3 className="font-bold text-base text-gray-900 mt-1 line-clamp-1">{e.course?.title}</h3>
                        </div>
                      </div>

                      <ProgressBar percentage={prog.completionPercentage} size="sm" color="blue" />

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {prog.completedLessons} of {prog.totalLessons || e.course?.lessons?.length || 0} Lessons Completed
                        </span>
                        <Link
                          href={`/courses/${e.courseId}`}
                          className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
                        >
                          <span>Continue</span>
                          <PlayCircle className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Upcoming & Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Upcoming Assignments</span>
            </h3>

            <div className="space-y-3">
              <Link
                href="/assignments"
                className="block p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/60 border border-purple-100 transition-colors"
              >
                <div className="font-bold text-xs text-purple-900">Build Next.js REST API Endpoint</div>
                <div className="text-[11px] text-purple-700 mt-1">Due in 5 days • 100 Marks</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
