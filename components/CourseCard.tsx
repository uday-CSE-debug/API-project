'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Users, Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface CourseCardProps {
  id: string;
  title: string;
  instructorName?: string;
  category: string;
  level: string;
  duration: string;
  rating?: number;
  studentCount?: number;
  thumbnail: string;
  price?: number;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
}

export default function CourseCard({
  id,
  title,
  instructorName = 'LearnHub Instructor',
  category,
  level,
  duration,
  rating = 4.8,
  studentCount = 120,
  thumbnail,
  price = 0,
  isEnrolled = false,
  onEnroll,
}: CourseCardProps) {
  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {category}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${getLevelBadgeColor(level)}`}>
            {level}
          </span>
        </div>
        {price > 0 ? (
          <div className="absolute bottom-3 right-3 bg-gray-900/90 text-white font-black text-sm px-3 py-1 rounded-xl">
            ${price.toFixed(2)}
          </div>
        ) : (
          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider">
            Free
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Instructor & Rating */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">{instructorName}</span>
            <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/courses/${id}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
              {title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Meta specs */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span>{studentCount} Students</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${id}`}
              className="flex-1 text-center py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Details
            </Link>

            {isEnrolled ? (
              <Link
                href={`/courses/${id}`}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enrolled</span>
              </Link>
            ) : (
              <button
                onClick={() => onEnroll ? onEnroll(id) : (window.location.href = `/courses/${id}`)}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
