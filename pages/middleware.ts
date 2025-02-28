import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  
  if (sessionToken) {
    await prisma.session.updateMany({
      where: { sessionToken },
      data: { updatedAt: new Date() }
    });
  }

  return NextResponse.next();
}