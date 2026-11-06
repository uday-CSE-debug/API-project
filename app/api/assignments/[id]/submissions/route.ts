import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id: assignmentId } = params;

    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        assignment: { select: { title: true, maximumMarks: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return apiResponse(true, 'Submissions fetched successfully', submissions, 200);
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return apiResponse(false, error.message || 'Error fetching submissions', null, 500);
  }
}
