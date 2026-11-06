'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, LayoutDashboard, Menu, X, Shield, Award, FileText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'INSTRUCTOR') return '/dashboard/instructor';
    return '/dashboard/student';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tight">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Learn<span className="text-gray-900">Hub</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/courses') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Courses
            </Link>
            <Link
              href={user ? '/my-courses' : '/login'}
              className={`text-sm font-medium transition-colors ${
                pathname === '/my-courses' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              My Learning
            </Link>
            <Link
              href="/assignments"
              className={`text-sm font-medium transition-colors ${
                pathname === '/assignments' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Assignments
            </Link>
            <Link
              href="/api-docs"
              className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              API Docs
            </Link>
          </div>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-1.5 pr-4 rounded-full hover:bg-gray-100 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-blue-500"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-900 leading-tight">{user.name}</div>
                    <div className="text-[10px] uppercase font-semibold text-blue-600">{user.role}</div>
                  </div>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transition-all transform origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{user.role} Dashboard</span>
                    </Link>

                    <Link
                      href="/my-courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>My Enrolled Courses</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin/users"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Manage Users</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-800 hover:text-blue-600 py-1"
          >
            Home
          </Link>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-800 hover:text-blue-600 py-1"
          >
            Courses
          </Link>
          <Link
            href="/my-courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-800 hover:text-blue-600 py-1"
          >
            My Learning
          </Link>
          <Link
            href="/assignments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-800 hover:text-blue-600 py-1"
          >
            Assignments
          </Link>
          {user ? (
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-blue-600 py-1"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="block text-base font-semibold text-red-600 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-gray-200 font-bold text-gray-800"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
