import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { studentId } = params;

    // Check permissions
    if (user.role !== 'ADMIN' && user.id !== studentId) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, email: true, avatar: true } },
            lessons: { select: { id: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return apiResponse(true, 'Student enrollments fetched', enrollments, 200);
  } catch (error: any) {
    console.error('Get student enrollments error:', error);
    return apiResponse(false, error.message || 'Error fetching student enrollments', null, 500);
  }
}
