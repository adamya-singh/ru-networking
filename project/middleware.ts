import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export async function middleware(request: NextRequest) {
  try {
    console.log('Middleware - Processing request for:', request.nextUrl.pathname);
    
    const response = NextResponse.next();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            console.log('Middleware - Getting cookie:', name);
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            console.log('Middleware - Setting cookie:', name);
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            console.log('Middleware - Removing cookie:', name);
            response.cookies.delete(name, options);
          },
        },
      }
    );

    // First check if we have a session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // If we have a session, verify it with getUser()
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log('Middleware - Invalid session, redirecting to signin');
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      
      console.log('Middleware - Valid session for user:', user.email);
    }

    // If there's no session and the user is trying to access a protected route
    if (!session && request.nextUrl.pathname.startsWith("/schedule")) {
      console.log('Middleware - No session, redirecting to signin');
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    if (error instanceof Error) {
      console.error('Middleware error stack:', error.stack);
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}