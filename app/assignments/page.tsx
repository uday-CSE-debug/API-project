'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText, CheckCircle2, Clock, Upload, ArrowRight, ExternalLink } from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments', {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ submissionText, fileUrl }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        alert('Assignment submitted successfully!');
        setSelectedAssignment(null);
        setSubmissionText('');
        setFileUrl('');
        fetchAssignments();
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 bg-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <FileText className="w-4 h-4" />
          <span>Course Projects & Labs</span>
        </div>
        <h1 className="text-3xl font-black">Course Assignments</h1>
        <p className="text-purple-100 text-sm max-w-xl">
          Review assignment criteria, submit your code repository/file links, and check instructor grades.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 space-y-3">
          <FileText className="w-12 h-12 text-purple-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Assignments Available</h3>
          <p className="text-xs text-gray-500">There are no pending assignments posted at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const mySubmission = assignment.submissions && assignment.submissions.length > 0 ? assignment.submissions[0] : null;

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                    {assignment.course?.title}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{assignment.description}</p>
                  <div className="flex gap-4 text-xs font-bold text-amber-600 pt-1">
                    <span>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span>Max Marks: {assignment.maximumMarks}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 space-y-2">
                  {mySubmission ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Submission Received ({mySubmission.status})</span>
                      </div>
                      {mySubmission.marksObtained !== null && (
                        <div className="font-extrabold text-emerald-900 text-sm">
                          Score: {mySubmission.marksObtained} / {assignment.maximumMarks}
                        </div>
                      )}
                      {mySubmission.feedback && (
                        <p className="text-[11px] text-emerald-700 italic">Feedback: "{mySubmission.feedback}"</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedAssignment.title}</h3>
              <p className="text-xs text-gray-500 mt-1">Submit your project explanation and file/GitHub URL below.</p>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Submission Notes / Code Summary</label>
                <textarea
                  required
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Explain your approach, architecture, or test results..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GitHub / Project URL (Optional)</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="w-1/2 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-3 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
