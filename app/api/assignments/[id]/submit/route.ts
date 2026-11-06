import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiResponse(false, 'Unauthorized', null, 401);
    }

    const { id: assignmentId } = params;
    const body = await req.json();
    const { submissionText, fileUrl } = body;

    if (!submissionText) {
      return apiResponse(false, 'Submission text is required', null, 400);
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return apiResponse(false, 'Assignment not found', null, 404);
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.id,
        },
      },
    });

    if (existingSubmission) {
      const updated = await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          submissionText,
          fileUrl: fileUrl || existingSubmission.fileUrl,
          submittedAt: new Date(),
          status: 'PENDING',
        },
      });
      return apiResponse(true, 'Assignment submission updated successfully!', updated, 200);
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: user.id,
        submissionText,
        fileUrl: fileUrl || null,
        status: 'PENDING',
      },
    });

    return apiResponse(true, 'Assignment submitted successfully!', submission, 201);
  } catch (error: any) {
    console.error('Assignment submission error:', error);
    return apiResponse(false, error.message || 'Error submitting assignment', null, 500);
  }
}
