import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: courseId } = params;
    const user = await getUserFromRequest(req);

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderNumber: 'asc' },
    });

    // If user is logged in, attach lesson progress
    let completedLessonIds: string[] = [];
    if (user) {
      const progresses = await prisma.lessonProgress.findMany({
        where: {
          studentId: user.id,
          lesson: { courseId },
          completed: true,
        },
        select: { lessonId: true },
      });
      completedLessonIds = progresses.map((p) => p.lessonId);
    }

    const result = lessons.map((lesson) => ({
      ...lesson,
      completed: completedLessonIds.includes(lesson.id),
    }));

    return apiResponse(true, 'Lessons fetched successfully', result, 200);
  } catch (error: any) {
    console.error('Fetch lessons error:', error);
    return apiResponse(false, error.message || 'Error fetching lessons', null, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id: courseId } = params;
    const body = await req.json();
    const { title, description, videoUrl, duration, orderNumber } = body;

    if (!title || !videoUrl) {
      return apiResponse(false, 'Title and videoUrl are required', null, 400);
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { orderNumber: 'desc' },
    });

    const nextOrder = orderNumber ? parseInt(orderNumber.toString()) : (lastLesson?.orderNumber || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        description: description || '',
        videoUrl,
        duration: duration || '15 mins',
        orderNumber: nextOrder,
      },
    });

    return apiResponse(true, 'Lesson created successfully', lesson, 201);
  } catch (error: any) {
    console.error('Create lesson error:', error);
    return apiResponse(false, error.message || 'Error creating lesson', null, 500);
  }
}
