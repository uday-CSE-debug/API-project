'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, Clock, Award, ArrowLeft, AlertCircle } from 'lucide-react';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!quizId) return;

    fetch(`/api/quizzes/${quizId}`, {
      headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuiz(data.data);
          setTimeLeft((data.data.duration || 30) * 60);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [quizId, user]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      alert('Please log in to submit quiz');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setResult(data.data);
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      alert('Error submitting quiz');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm mt-3">Loading assessment quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Quiz Not Found</h2>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course</span>
      </button>

      {/* Quiz Title & Header */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            Course Assessment Quiz
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">{quiz.title}</h1>
          <p className="text-xs text-gray-500 mt-1">{quiz.description}</p>
        </div>

        {!result && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-sm px-4 py-2 rounded-2xl shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Time Remaining: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Quiz Result View */}
      {result ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl font-bold ${
              result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {result.passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900">
              {result.passed ? 'Quiz Passed!' : 'Quiz Attempt Complete'}
            </h2>
            <p className="text-sm text-gray-500">
              Your Score: <span className="font-bold text-gray-900">{result.score}</span> / {result.totalMarks} ({result.percentage}%)
            </p>
          </div>

          <div className="text-left space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Question Breakdowns:</h3>
            {result.questionResults?.map((q: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  q.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="font-bold text-gray-900">
                  {idx + 1}. {q.question}
                </div>
                <div className="flex gap-4 font-semibold text-gray-600">
                  <span>Your Answer: {q.studentAnswer}</span>
                  <span>Correct Answer: {q.correctAnswer}</span>
                  <span className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                    +{q.marksObtained} Marks
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/dashboard/student')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-6">
          {quiz.questions?.map((q: any, idx: number) => (
            <div key={q.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-gray-900">
                  {idx + 1}. {q.question}
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {q.marks} Marks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'A', text: q.optionA },
                  { key: 'B', text: q.optionB },
                  { key: 'C', text: q.optionC },
                  { key: 'D', text: q.optionD },
                ].map((opt) => {
                  const isSelected = answers[q.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleOptionSelect(q.id, opt.key)}
                      className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-gray-50 text-gray-800 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                          isSelected ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.01]"
          >
            {submitting ? 'Calculating Score...' : 'Submit Quiz Answers'}
          </button>
        </div>
      )}
    </div>
  );
}
