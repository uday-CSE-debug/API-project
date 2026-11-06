import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminUser = await getUserFromRequest(req);
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body; // "ACTIVE" or "INACTIVE"

    if (!status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
      return apiResponse(false, 'Invalid status', null, 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return apiResponse(true, `User status updated to ${status}`, updatedUser, 200);
  } catch (error: any) {
    console.error('Update user status error:', error);
    return apiResponse(false, error.message || 'Error updating user status', null, 500);
  }
}
