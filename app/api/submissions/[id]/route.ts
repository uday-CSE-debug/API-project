import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    const body = await req.json();
    const { marksObtained, feedback } = body;

    if (marksObtained === undefined) {
      return apiResponse(false, 'Marks obtained is required', null, 400);
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        marksObtained: parseInt(marksObtained.toString()),
        feedback: feedback || '',
        status: 'GRADED',
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    return apiResponse(true, 'Submission graded successfully', submission, 200);
  } catch (error: any) {
    console.error('Grade submission error:', error);
    return apiResponse(false, error.message || 'Error grading submission', null, 500);
  }
}
