'use client';

import React, { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'All',
    'Web Development',
    'Java',
    'Python',
    'Data Science',
    'Machine Learning',
    'Database',
    'Cloud Computing',
    'Cyber Security',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchCourses = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (level && level !== 'All') params.append('level', level);
    if (sortBy) params.append('sortBy', sortBy);

    fetch(`/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, [category, level, sortBy]);

  useEffect(() => {
    if (user) {
      fetch('/api/enrollments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const enrolledIds = data.data.map((e: any) => e.courseId);
            setUserEnrollments(enrolledIds);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Successfully enrolled in the course!');
        setUserEnrollments((prev) => [...prev, courseId]);
      } else {
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Explore Professional Courses</h1>
        <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
          Browse our extensive collection of tech courses, enroll instantly, and master skills through video lessons, quizzes, and assignments.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, topic, or keyword..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 shrink-0"
          >
            Search Courses
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs font-semibold">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-500 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  category === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level and Sort Selects */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Level:</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="popularity">Most Popular / Highest Rated</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Courses Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            We couldn't find any courses matching your search criteria. Try adjusting your filters or search keyword.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setLevel('All');
              setSortBy('newest');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructorName={course.instructor?.name}
              category={course.category}
              level={course.level}
              duration={course.duration}
              rating={course.rating}
              studentCount={course.studentCount}
              thumbnail={course.thumbnail}
              price={course.price}
              isEnrolled={userEnrollments.includes(course.id)}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}
