import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-2xl">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>Learn<span className="text-blue-400">Hub</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering learners worldwide with cutting-edge software engineering, database design, and AI masterclasses.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Popular Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/courses?category=Web Development" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link href="/courses?category=Java" className="hover:text-white transition-colors">Java & Spring Boot</Link></li>
              <li><Link href="/courses?category=Python" className="hover:text-white transition-colors">Python Programming</Link></li>
              <li><Link href="/courses?category=Machine Learning" className="hover:text-white transition-colors">Machine Learning & Data Science</Link></li>
              <li><Link href="/courses?category=Database" className="hover:text-white transition-colors">Database Management</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">Explore All Courses</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Join as Instructor</Link></li>
              <li><Link href="/api-docs" className="hover:text-white transition-colors">OpenAPI Documentation</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform Support</h3>
            <p className="text-slate-400 text-sm mb-4">
              Have questions or need assistance with enrollment? Reach out to our 24/7 student support team.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold">
              <Mail className="w-4 h-4" />
              <span>support@learnhub.edu</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 LearnHub Platform Inc. All rights reserved. College Project Demonstration.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
