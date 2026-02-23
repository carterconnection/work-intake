import { clearAdminSessionCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  clearAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
