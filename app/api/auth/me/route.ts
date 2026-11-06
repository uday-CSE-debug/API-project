import { NextRequest } from 'next/server';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return apiResponse(false, 'Unauthorized or session expired', null, 401);
  }
  return apiResponse(true, 'Current user profile fetched', { user }, 200);
}
