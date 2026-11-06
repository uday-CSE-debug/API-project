import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const response = apiResponse(true, 'Logged out successfully', null, 200);
  response.cookies.delete('token');
  return response;
}
