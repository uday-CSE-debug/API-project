'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Code2, Server, Shield, FileCode, CheckCircle2 } from 'lucide-react';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error(err));
  }, []);

  const getMethodBadgeColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Code2 className="w-5 h-5" />
          <span>Interactive REST API Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">LearnHub OpenAPI Specification</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Complete REST API documentation for authentication, course enrollment, lesson video streaming, quizzes, assignments, and admin management.
        </p>
      </div>

      {spec && (
        <div className="space-y-8">
          {/* Tags / Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spec.tags?.map((tag: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <div className="font-bold text-gray-900 text-sm">{tag.name}</div>
                <div className="text-xs text-gray-500">{tag.description}</div>
              </div>
            ))}
          </div>

          {/* Endpoints List */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900">API Endpoint Directory</h2>

            <div className="space-y-4">
              {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => (
                <div key={path} className="border border-gray-100 rounded-2xl p-5 space-y-3 bg-gray-50/50">
                  {Object.entries(methods).map(([method, details]: [string, any]) => (
                    <div key={method} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black px-3 py-1 rounded-lg border uppercase ${getMethodBadgeColor(method)}`}>
                          {method}
                        </span>
                        <code className="text-sm font-bold text-gray-900 font-mono">{path}</code>
                      </div>
                      <p className="text-xs text-gray-600 pl-1">{details.summary}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
