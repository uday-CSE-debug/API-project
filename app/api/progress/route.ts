import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
        ...(courseId ? { courseId } : {}),
      },
      include: {
        course: {
          include: {
            lessons: true,
            quizzes: true,
            assignments: true,
          },
        },
      },
    });

    const progressData = await Promise.all(
      enrollments.map(async (e) => {
        const totalLessons = e.course.lessons.length;

        // Completed lessons count
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            studentId: user.id,
            completed: true,
            lesson: { courseId: e.courseId },
          },
        });

        // Quiz score average for this course
        const quizAttempts = await prisma.quizAttempt.findMany({
          where: {
            studentId: user.id,
            quiz: { courseId: e.courseId },
          },
        });

        const avgQuizPercentage =
          quizAttempts.length > 0
            ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length)
            : 0;

        // Submissions for course assignments
        const submissions = await prisma.submission.findMany({
          where: {
            studentId: user.id,
            assignment: { courseId: e.courseId },
            status: 'GRADED',
          },
        });

        const avgAssignmentScore =
          submissions.length > 0
            ? Math.round(submissions.reduce((acc, s) => acc + (s.marksObtained || 0), 0) / submissions.length)
            : 0;

        const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          id: e.id,
          studentId: user.id,
          courseId: e.courseId,
          courseTitle: e.course.title,
          courseThumbnail: e.course.thumbnail,
          completedLessons,
          totalLessons,
          quizScore: avgQuizPercentage,
          assignmentScore: avgAssignmentScore,
          completionPercentage,
          lastAccessed: new Date(),
        };
      })
    );

    if (courseId && progressData.length > 0) {
      return apiResponse(true, 'Progress calculated for course', progressData[0], 200);
    }

    return apiResponse(true, 'All progress items calculated', progressData, 200);
  } catch (error: any) {
    console.error('Fetch progress error:', error);
    return apiResponse(false, error.message || 'Error fetching progress', null, 500);
  }
}
