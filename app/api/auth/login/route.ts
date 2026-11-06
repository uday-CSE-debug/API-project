import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiResponse(false, 'Email and password are required', null, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return apiResponse(false, 'Invalid email or password', null, 401);
    }

    if (user.status === 'INACTIVE') {
      return apiResponse(false, 'Your account has been deactivated. Please contact support.', null, 403);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return apiResponse(false, 'Invalid email or password', null, 401);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
    };

    const response = apiResponse(true, 'Login successful', { user: userData, token }, 200);
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return apiResponse(false, error.message || 'Internal server error', null, 500);
  }
}
