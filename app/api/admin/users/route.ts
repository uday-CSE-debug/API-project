import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return apiResponse(false, 'Forbidden', null, 403);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            courses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiResponse(true, 'Users fetched successfully', users, 200);
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return apiResponse(false, error.message || 'Error fetching users', null, 500);
  }
}
