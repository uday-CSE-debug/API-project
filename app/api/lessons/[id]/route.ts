import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, videoUrl, duration, orderNumber } = body;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(videoUrl && { videoUrl }),
        ...(duration && { duration }),
        ...(orderNumber !== undefined && { orderNumber: parseInt(orderNumber.toString()) }),
      },
    });

    return apiResponse(true, 'Lesson updated successfully', lesson, 200);
  } catch (error: any) {
    console.error('Update lesson error:', error);
    return apiResponse(false, error.message || 'Error updating lesson', null, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    await prisma.lesson.delete({ where: { id } });

    return apiResponse(true, 'Lesson deleted successfully', null, 200);
  } catch (error: any) {
    console.error('Delete lesson error:', error);
    return apiResponse(false, error.message || 'Error deleting lesson', null, 500);
  }
}
