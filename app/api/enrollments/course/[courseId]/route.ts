import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { courseId } = params;

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true, createdAt: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return apiResponse(true, 'Course enrollments fetched', enrollments, 200);
  } catch (error: any) {
    console.error('Get course enrollments error:', error);
    return apiResponse(false, error.message || 'Error fetching course enrollments', null, 500);
  }
}
