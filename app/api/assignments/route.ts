import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const user = await getUserFromRequest(req);

    const where: any = {};
    if (courseId) {
      where.courseId = courseId;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true } },
        submissions: user
          ? {
              where: user.role === 'STUDENT' ? { studentId: user.id } : undefined,
              include: {
                student: { select: { id: true, name: true, email: true } },
              },
            }
          : false,
      },
      orderBy: { dueDate: 'asc' },
    });

    return apiResponse(true, 'Assignments fetched successfully', assignments, 200);
  } catch (error: any) {
    console.error('Fetch assignments error:', error);
    return apiResponse(false, error.message || 'Error fetching assignments', null, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const body = await req.json();
    const { courseId, title, description, dueDate, maximumMarks = 100 } = body;

    if (!courseId || !title || !description || !dueDate) {
      return apiResponse(false, 'Course ID, title, description, and dueDate are required', null, 400);
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description,
        dueDate: new Date(dueDate),
        maximumMarks: parseInt(maximumMarks.toString()) || 100,
      },
    });

    return apiResponse(true, 'Assignment created successfully', assignment, 201);
  } catch (error: any) {
    console.error('Create assignment error:', error);
    return apiResponse(false, error.message || 'Error creating assignment', null, 500);
  }
}
