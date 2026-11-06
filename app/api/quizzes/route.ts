import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const body = await req.json();
    const { courseId, title, description, duration = 30, questions = [] } = body;

    if (!courseId || !title || questions.length === 0) {
      return apiResponse(false, 'Course ID, title, and at least one question are required', null, 400);
    }

    const totalMarks = questions.reduce((acc: number, q: any) => acc + (parseInt(q.marks) || 10), 0);

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        description: description || '',
        totalMarks,
        duration: parseInt(duration.toString()) || 30,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            marks: parseInt(q.marks) || 10,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return apiResponse(true, 'Quiz created successfully', quiz, 201);
  } catch (error: any) {
    console.error('Create quiz error:', error);
    return apiResponse(false, error.message || 'Error creating quiz', null, 500);
  }
}
