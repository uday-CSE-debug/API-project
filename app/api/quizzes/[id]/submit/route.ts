import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized: Please login to submit quiz', null, 401);
    }

    const { id: quizId } = params;
    const body = await req.json();
    const { answers } = body; // object: { [questionId]: "A" | "B" | "C" | "D" }

    if (!answers) {
      return apiResponse(false, 'Answers are required', null, 400);
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return apiResponse(false, 'Quiz not found', null, 404);
    }

    let score = 0;
    let totalMarks = 0;
    const questionResults: any[] = [];

    quiz.questions.forEach((q) => {
      totalMarks += q.marks;
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer === q.correctAnswer;
      if (isCorrect) {
        score += q.marks;
      }
      questionResults.push({
        questionId: q.id,
        question: q.question,
        studentAnswer: studentAnswer || 'None',
        correctAnswer: q.correctAnswer,
        isCorrect,
        marksObtained: isCorrect ? q.marks : 0,
        totalMarks: q.marks,
      });
    });

    const percentage = Math.round((score / (totalMarks || 1)) * 100);
    const passed = percentage >= 50;

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId: user.id,
        score,
        totalMarks,
        percentage,
        passed,
      },
    });

    return apiResponse(
      true,
      'Quiz submitted successfully!',
      {
        attemptId: attempt.id,
        score,
        totalMarks,
        percentage,
        passed,
        questionResults,
      },
      200
    );
  } catch (error: any) {
    console.error('Quiz submit error:', error);
    return apiResponse(false, error.message || 'Error submitting quiz', null, 500);
  }
}
