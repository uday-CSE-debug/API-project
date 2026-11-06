import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return apiResponse(false, 'Forbidden: Admin access required', null, 403);
    }

    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalInstructors = await prisma.user.count({ where: { role: 'INSTRUCTOR' } });
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const totalLessons = await prisma.lesson.count();
    const totalQuizzes = await prisma.quiz.count();
    const totalAssignments = await prisma.assignment.count();

    const recentEnrollments = await prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        course: { select: { id: true, title: true, price: true } },
      },
    });

    const categoryDistribution = await prisma.course.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    return apiResponse(
      true,
      'Admin statistics fetched successfully',
      {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        totalLessons,
        totalQuizzes,
        totalAssignments,
        recentEnrollments,
        categoryDistribution,
      },
      200
    );
  } catch (error: any) {
    console.error('Fetch admin stats error:', error);
    return apiResponse(false, error.message || 'Error fetching statistics', null, 500);
  }
}
