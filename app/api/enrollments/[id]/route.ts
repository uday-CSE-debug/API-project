import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { id } = params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      return apiResponse(false, 'Enrollment not found', null, 404);
    }

    if (user.role !== 'ADMIN' && enrollment.studentId !== user.id) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    await prisma.enrollment.delete({
      where: { id },
    });

    return apiResponse(true, 'Enrollment cancelled successfully', null, 200);
  } catch (error: any) {
    console.error('Delete enrollment error:', error);
    return apiResponse(false, error.message || 'Error cancelling enrollment', null, 500);
  }
}
