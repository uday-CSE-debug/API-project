'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Users,
  PlusCircle,
  TrendingUp,
  FileText,
  HelpCircle,
  Trash2,
  Edit,
  Video,
} from 'lucide-react';

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lesson & Quiz modal state
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState('20 mins');

  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');

  const fetchInstructorCourses = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/courses?instructorId=${user.id}`);
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
    fetchInstructorCourses();
  }, [user]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        alert('Course deleted successfully');
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      } else {
        alert(data.message || 'Deletion failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/courses/${selectedCourseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: lessonTitle,
          videoUrl: lessonVideoUrl,
          duration: lessonDuration,
          description: 'Lesson content',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Lesson added successfully!');
        setShowAddLessonModal(false);
        setLessonTitle('');
        setLessonVideoUrl('');
        fetchInstructorCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: quizTitle,
          description: 'Module assessment quiz',
          duration: 20,
          questions: [
            {
              question: quizQuestion,
              optionA,
              optionB,
              optionC,
              optionD,
              correctAnswer,
              marks: 10,
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Quiz created successfully!');
        setShowAddQuizModal(false);
        setQuizTitle('');
        setQuizQuestion('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-sm text-gray-500">Instructor credentials required to access this portal.</p>
        <Link href="/login" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl inline-block">
          Login as Instructor
        </Link>
      </div>
    );
  }

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessonCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-purple-200">
            Instructor Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Instructor Dashboard</h1>
          <p className="text-purple-100 text-sm max-w-xl">
            Create and manage courses, upload lessons, design quizzes, and monitor student enrollment performance.
          </p>
        </div>

        <Link
          href="/instructor/courses/create"
          className="px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-sm rounded-2xl shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5 text-purple-600" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold bg-purple-50 px-2 py-0.5 rounded">Courses</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalCourses}</div>
          <div className="text-xs text-gray-500 font-medium">Published Courses</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-blue-600">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold bg-blue-50 px-2 py-0.5 rounded">Students</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalStudents}</div>
          <div className="text-xs text-gray-500 font-medium">Total Enrollments</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <Video className="w-5 h-5" />
            <span className="text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">Lessons</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalLessons}</div>
          <div className="text-xs text-gray-500 font-medium">Total Video Lessons</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">Average</span>
          </div>
          <div className="text-3xl font-black text-gray-900">4.9 / 5.0</div>
          <div className="text-xs text-gray-500 font-medium">Average Course Rating</div>
        </div>
      </div>

      {/* Courses Table / List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-900">My Managed Courses</h2>
          <Link
            href="/instructor/courses/create"
            className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Course</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-gray-500 text-sm">You haven't created any courses yet.</p>
            <Link
              href="/instructor/courses/create"
              className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl inline-block"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Lessons</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-semibold">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{course.title}</div>
                        <div className="text-xs text-gray-400">{course.duration}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{course.category}</td>
                    <td className="py-4 px-4 text-gray-600">{course.level}</td>
                    <td className="py-4 px-4 text-purple-600 font-bold">{course.studentCount}</td>
                    <td className="py-4 px-4 text-gray-600">{course.lessonCount}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setShowAddLessonModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
                      >
                        + Lesson
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setShowAddQuizModal(true);
                        }}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold"
                      >
                        + Quiz
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Add Lesson to Course</h3>
            <form onSubmit={handleAddLessonSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Next.js Routing Deep Dive"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Video Embed URL</label>
                <input
                  type="url"
                  required
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  placeholder="25 mins"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="w-1/2 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Quiz Modal */}
      {showAddQuizModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Create Quiz Question</h3>
            <form onSubmit={handleAddQuizSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Module Quiz Assessment"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Question Text</label>
                <input
                  type="text"
                  required
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  placeholder="Which hook is used for side effects in React?"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Option A</label>
                  <input
                    type="text"
                    required
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="useState"
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Option B</label>
                  <input
                    type="text"
                    required
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="useEffect"
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Option C</label>
                  <input
                    type="text"
                    required
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="useContext"
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Option D</label>
                  <input
                    type="text"
                    required
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="useMemo"
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correct Answer</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="w-1/2 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
