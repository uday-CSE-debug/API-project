'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Sparkles, Award, ShieldCheck, TrendingUp, Users, CheckCircle2, ArrowRight, PlayCircle, Star } from 'lucide-react';

export default function HomePage() {
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses?sortBy=popularity')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPopularCourses(data.data.slice(0, 4));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { title: 'Web Development', count: '12 Courses', icon: '💻', color: 'bg-blue-50 text-blue-600' },
    { title: 'Java Programming', count: '8 Courses', icon: '☕', color: 'bg-orange-50 text-orange-600' },
    { title: 'Python', count: '15 Courses', icon: '🐍', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Machine Learning', count: '6 Courses', icon: '🤖', color: 'bg-purple-50 text-purple-600' },
    { title: 'Database Systems', count: '7 Courses', icon: '🗄️', color: 'bg-cyan-50 text-cyan-600' },
    { title: 'Cloud Computing', count: '9 Courses', icon: '☁️', color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Cyber Security', count: '5 Courses', icon: '🛡️', color: 'bg-rose-50 text-rose-600' },
    { title: 'Data Science', count: '10 Courses', icon: '📊', color: 'bg-amber-50 text-amber-600' },
  ];

  const stats = [
    { label: 'Active Students', value: '15,000+' },
    { label: 'Expert Instructors', value: '120+' },
    { label: 'Published Courses', value: '250+' },
    { label: 'Course Completion Rate', value: '94%' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Next-Generation College E-Learning</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Learn. Grow. <span className="text-blue-600 underline decoration-blue-300 decoration-wavy">Succeed.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal">
              Learn new skills, enroll in professional courses, and track your progress with our online learning platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-base rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Floating background blobs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-blue-600 text-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-blue-600/10">
          {stats.map((st, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black">{st.value}</div>
              <div className="text-xs sm:text-sm text-blue-100 font-medium">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Popular Featured Courses</h2>
            <p className="text-gray-500 text-sm mt-1">Hand-crafted curriculum taught by industry leaders.</p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course) => (
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
              />
            ))}
          </div>
        )}
      </section>

      {/* Learning Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Explore Top Learning Categories</h2>
          <p className="text-gray-500 text-sm mt-1">Choose from over 8+ specialized tech domains.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={`/courses?category=${encodeURIComponent(cat.title)}`}
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all text-center space-y-3 group"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{cat.title}</h3>
              <p className="text-xs text-gray-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold">Why Choose LearnHub?</h2>
            <p className="text-slate-400 text-sm">Designed specifically to deliver real-world software engineering competencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Interactive Lessons</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Step-by-step video tutorials and interactive lesson completion tracking for structured progress.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Quizzes & Assessments</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Test your knowledge with automated quizzes, instant score calculation, and performance metrics.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Progress</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visual progress bars and comprehensive student/instructor analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What Our Students Say</h2>
          <p className="text-gray-500 text-sm mt-1">Real feedback from computer science students and engineers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Emily Davis',
              role: 'Computer Science Major',
              comment: 'The instant enrollment and structured lesson progress helped me pass my web development lab with top grades!',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
            },
            {
              name: 'Marcus Chen',
              role: 'Full Stack Learner',
              comment: 'The Next.js and Spring Boot curriculum is extremely practical. Quizzes after each module really reinforced concepts.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
            },
            {
              name: 'Sophia Patel',
              role: 'Data Science Student',
              comment: 'Loved the assignment submission feature and immediate instructor feedback on coding projects.',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm italic">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
