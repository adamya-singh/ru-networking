import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes that require authentication
  /*if (!session && (
    req.nextUrl.pathname.startsWith('/schedule') ||
    req.nextUrl.pathname.startsWith('/saved-schedules')
  )) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }*/

  return res;
}