'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProgressBar from '@/components/ProgressBar';
import {
  CheckCircle2,
  Clock,
  Users,
  Star,
  PlayCircle,
  FileText,
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  Award,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes' | 'assignments'>('lessons');

  const fetchCourseData = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.success) {
        setCourse(data.data);
        if (data.data.lessons?.length > 0) {
          setActiveLesson(data.data.lessons[0]);
        }
      }

      const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
      });
      const lessonsData = await lessonsRes.json();
      if (lessonsData.success) {
        setLessons(lessonsData.data);
      }

      if (user) {
        const enrollRes = await fetch(`/api/enrollments/student/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const enrollData = await enrollRes.json();
        if (enrollData.success && Array.isArray(enrollData.data)) {
          const match = enrollData.data.find((e: any) => e.courseId === courseId);
          if (match) {
            setIsEnrolled(true);
            setEnrollmentId(match.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const handleEnrollNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
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
      setEnrolling(false);

      if (data.success) {
        setIsEnrolled(true);
        setEnrollmentId(data.data.id);
        setSuccessModal(true);
      } else {
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      setEnrolling(false);
      console.error(err);
      alert('Failed to connect to server');
    }
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!isEnrolled) return;
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setLessons((prev) =>
          prev.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-medium text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <button
            onClick={() => router.push('/courses')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {course.category}
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                  {course.level} Level
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{course.title}</h1>
              <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'}
                    alt={course.instructor?.name}
                    className="w-8 h-8 rounded-full object-cover border border-blue-500"
                  />
                  <div>
                    <div className="text-white font-bold">{course.instructor?.name}</div>
                    <div className="text-[10px]">Course Instructor</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{course.studentCount} Students Enrolled</span>
                </div>
              </div>
            </div>

            {/* Action Box Card */}
            <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-2xl shadow-sm"
              />

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>You are Enrolled in this Course</span>
                    </div>
                    <ProgressBar percentage={progressPercent} size="md" color="emerald" />
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/student')}
                    className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-lg transition-all text-center block"
                  >
                    Go to Student Dashboard
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-gray-900">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-semibold">$199.99</span>
                  </div>

                  <button
                    onClick={handleEnrollNow}
                    disabled={enrolling}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      <span>Enrolling...</span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Enroll Now</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    Full lifetime access • Quizzes included • Certificate of Completion
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Lesson Video & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-4 border-b border-gray-200 font-bold text-sm">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                activeTab === 'lessons'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Lessons ({lessons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                activeTab === 'quizzes'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quizzes ({course.quizzes?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Assignments ({course.assignments?.length || 0})</span>
            </button>
          </div>

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              {/* Active Video Player */}
              {activeLesson && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activeLesson.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activeLesson.description}</p>
                    </div>

                    {isEnrolled && (
                      <button
                        onClick={() => handleToggleLessonComplete(activeLesson.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                          activeLesson.completed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{activeLesson.completed ? 'Completed' : 'Mark Completed'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Lesson Playlist */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-extrabold text-gray-900">Course Curriculum</h3>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                        activeLesson?.id === lesson.id
                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-bold text-xs text-gray-700 shadow-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-sm leading-snug">{lesson.title}</div>
                          <div className="text-xs text-gray-500">{lesson.duration}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lesson.completed ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : !isEnrolled ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900">Course Quizzes</h3>
              {course.quizzes?.length === 0 ? (
                <p className="text-sm text-gray-500">No quizzes uploaded for this course yet.</p>
              ) : (
                <div className="space-y-3">
                  {course.quizzes?.map((quiz: any) => (
                    <div
                      key={quiz.id}
                      className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="font-bold text-base text-gray-900">{quiz.title}</div>
                        <p className="text-xs text-gray-500 mt-1">{quiz.description}</p>
                        <div className="flex gap-4 text-xs font-semibold text-gray-400 mt-2">
                          <span>Marks: {quiz.totalMarks}</span>
                          <span>Time: {quiz.duration} Mins</span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/quiz/${quiz.id}`)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900">Course Assignments</h3>
              {course.assignments?.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments created for this course yet.</p>
              ) : (
                <div className="space-y-3">
                  {course.assignments?.map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="font-bold text-base text-gray-900">{assignment.title}</div>
                        <p className="text-xs text-gray-500 mt-1">{assignment.description}</p>
                        <div className="text-xs font-semibold text-amber-600 mt-2">
                          Due Date: {new Date(assignment.dueDate).toLocaleDateString()} • Max Marks: {assignment.maximumMarks}
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/assignments`)}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
                      >
                        Submit Work
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Instructor & Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">About the Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'}
                alt={course.instructor?.name}
                className="w-14 h-14 rounded-2xl object-cover border border-blue-500"
              />
              <div>
                <div className="font-extrabold text-gray-900 text-base">{course.instructor?.name}</div>
                <div className="text-xs text-gray-500">{course.instructor?.email}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{course.instructor?.bio || 'Senior Educator & Computer Science Lead.'}</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Enrollment Successful!</h3>
              <p className="text-emerald-700 font-bold text-sm">Successfully enrolled in the course!</p>
              <p className="text-xs text-gray-500">
                You now have instant access to all video lessons, quizzes, and course assignments.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setSuccessModal(false);
                  router.push('/dashboard/student');
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md"
              >
                Go to My Dashboard
              </button>
              <button
                onClick={() => setSuccessModal(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
