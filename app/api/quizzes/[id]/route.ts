import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = await getUserFromRequest(req);

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        questions: true,
      },
    });

    if (!quiz) {
      return apiResponse(false, 'Quiz not found', null, 404);
    }

    // Hide correct answers if student is attempting
    const isStudent = !user || user.role === 'STUDENT';
    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      marks: q.marks,
      ...(isStudent ? {} : { correctAnswer: q.correctAnswer }),
    }));

    return apiResponse(
      true,
      'Quiz fetched successfully',
      {
        ...quiz,
        questions: sanitizedQuestions,
      },
      200
    );
  } catch (error: any) {
    console.error('Fetch quiz error:', error);
    return apiResponse(false, error.message || 'Error fetching quiz', null, 500);
  }
}
