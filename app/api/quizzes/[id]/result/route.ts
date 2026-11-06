import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { id: quizId } = params;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId,
        studentId: user.id,
      },
      orderBy: { attemptedAt: 'desc' },
      include: {
        quiz: { select: { title: true, courseId: true } },
      },
    });

    return apiResponse(true, 'Quiz results retrieved', attempts, 200);
  } catch (error: any) {
    console.error('Fetch quiz result error:', error);
    return apiResponse(false, error.message || 'Error fetching quiz results', null, 500);
  }
}
