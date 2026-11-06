import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true },
        },
        lessons: {
          orderBy: { orderNumber: 'asc' },
        },
        quizzes: {
          select: { id: true, title: true, description: true, totalMarks: true, duration: true },
        },
        assignments: {
          select: { id: true, title: true, description: true, dueDate: true, maximumMarks: true },
        },
        _count: {
          select: { enrollments: true, lessons: true },
        },
      },
    });

    if (!course) {
      return apiResponse(false, 'Course not found', null, 404);
    }

    const result = {
      ...course,
      studentCount: course._count.enrollments,
      lessonCount: course._count.lessons,
    };

    return apiResponse(true, 'Course details fetched successfully', result, 200);
  } catch (error: any) {
    console.error('Fetch course details error:', error);
    return apiResponse(false, error.message || 'Error fetching course', null, 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    const existingCourse = await prisma.course.findUnique({ where: { id } });

    if (!existingCourse) {
      return apiResponse(false, 'Course not found', null, 404);
    }

    if (user.role !== 'ADMIN' && existingCourse.instructorId !== user.id) {
      return apiResponse(false, 'Forbidden: You can only edit your own courses', null, 403);
    }

    const body = await req.json();
    const { title, description, category, level, duration, price, thumbnail, status } = body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(level && { level }),
        ...(duration && { duration }),
        ...(price !== undefined && { price: parseFloat(price.toString()) }),
        ...(thumbnail && { thumbnail }),
        ...(status && { status }),
      },
    });

    return apiResponse(true, 'Course updated successfully', updatedCourse, 200);
  } catch (error: any) {
    console.error('Update course error:', error);
    return apiResponse(false, error.message || 'Error updating course', null, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    const existingCourse = await prisma.course.findUnique({ where: { id } });

    if (!existingCourse) {
      return apiResponse(false, 'Course not found', null, 404);
    }

    if (user.role !== 'ADMIN' && existingCourse.instructorId !== user.id) {
      return apiResponse(false, 'Forbidden: You can only delete your own courses', null, 403);
    }

    await prisma.course.delete({ where: { id } });

    return apiResponse(true, 'Course deleted successfully', null, 200);
  } catch (error: any) {
    console.error('Delete course error:', error);
    return apiResponse(false, error.message || 'Error deleting course', null, 500);
  }
}
