import { setAdminSessionCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get('password')?.toString();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url));
  }

  setAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin', request.url));
}
