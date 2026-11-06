import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'STUDENT' } = body;

    // Validation
    if (!name || !email || !password) {
      return apiResponse(false, 'Name, email, and password are required', null, 400);
    }

    if (password.length < 6) {
      return apiResponse(false, 'Password must be at least 6 characters long', null, 400);
    }

    const validRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN'];
    const userRole = validRoles.includes(role?.toUpperCase()) ? role.toUpperCase() : 'STUDENT';

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return apiResponse(false, 'Email address is already registered', null, 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
        status: 'ACTIVE',
      },
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };

    const response = apiResponse(true, 'Registration successful', { user: userData, token }, 201);
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return apiResponse(false, error.message || 'Internal server error', null, 500);
  }
}
