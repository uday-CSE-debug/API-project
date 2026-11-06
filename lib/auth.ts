import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'learnhub_jwt_super_secret_key_2026_antigravity_master_key';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('token')?.value || '';
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user || user.status === 'INACTIVE') return null;

  return user;
}

export function apiResponse(success: boolean, message: string, data: any = null, status: number = 200) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
}
