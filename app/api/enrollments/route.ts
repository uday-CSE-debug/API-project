import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized: Please login to enroll', null, 401);
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return apiResponse(false, 'Course ID is required', null, 400);
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return apiResponse(false, 'Course not found', null, 404);
    }

    // Check duplicate enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return apiResponse(false, 'You are already enrolled in this course!', existingEnrollment, 400);
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: courseId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    return apiResponse(true, 'Successfully enrolled in the course!', enrollment, 201);
  } catch (error: any) {
    console.error('Enrollment error:', error);
    return apiResponse(false, error.message || 'Error enrolling in course', null, 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    let enrollments;

    if (user.role === 'ADMIN') {
      enrollments = await prisma.enrollment.findMany({
        include: {
          student: { select: { id: true, name: true, email: true, avatar: true } },
          course: {
            include: {
              instructor: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });
    } else {
      enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.id },
        include: {
          course: {
            include: {
              instructor: { select: { id: true, name: true, email: true, avatar: true } },
              lessons: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });
    }

    return apiResponse(true, 'Enrollments retrieved successfully', enrollments, 200);
  } catch (error: any) {
    console.error('Get enrollments error:', error);
    return apiResponse(false, error.message || 'Error fetching enrollments', null, 500);
  }
}
