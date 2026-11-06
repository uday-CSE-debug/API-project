import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { id: lessonId } = params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return apiResponse(false, 'Lesson not found', null, 404);
    }

    // Toggle or set completed
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        studentId_lessonId: {
          studentId: user.id,
          lessonId: lessonId,
        },
      },
    });

    if (existingProgress) {
      // Toggle completion state
      const updated = await prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: { completed: !existingProgress.completed },
      });
      return apiResponse(true, `Lesson marked as ${updated.completed ? 'completed' : 'incomplete'}`, updated, 200);
    } else {
      const created = await prisma.lessonProgress.create({
        data: {
          studentId: user.id,
          lessonId: lessonId,
          completed: true,
        },
      });
      return apiResponse(true, 'Lesson marked as completed!', created, 201);
    }
  } catch (error: any) {
    console.error('Complete lesson error:', error);
    return apiResponse(false, error.message || 'Error updating lesson progress', null, 500);
  }
}
