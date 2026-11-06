'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('30 Hours');
  const [price, setPrice] = useState('49.99');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          level,
          duration,
          price: parseFloat(price) || 0,
          thumbnail,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        alert('Course created successfully!');
        router.push('/dashboard/instructor');
      } else {
        alert(data.message || 'Course creation failed');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert('Error connecting to server');
    }
  };

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="space-y-1 border-b border-gray-100 pb-6">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Course Creator</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Create a New Course</h1>
          <p className="text-xs text-gray-500">Fill in the course details below to publish to the platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Next.js Architecture Masterclass"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what students will learn..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="Web Development">Web Development</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Database">Database</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="40 Hours"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Thumbnail Image URL</label>
            <input
              type="url"
              required
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-1/2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20"
            >
              {loading ? 'Publishing...' : 'Publish Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
