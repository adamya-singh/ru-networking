import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      console.log('Auth callback - Starting with code:', code);
      
      const cookieStore = await cookies();
      console.log('Auth callback - Cookie store type:', typeof cookieStore);
      console.log('Auth callback - Cookie store methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(cookieStore)));
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              console.log('Auth callback - Getting cookie:', name);
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              console.log('Auth callback - Setting cookie:', name);
              cookieStore.set(name, value, options);
            },
            remove(name: string, options: any) {
              console.log('Auth callback - Removing cookie:', name);
              cookieStore.delete(name, options);
            },
          },
        }
      );
      
      console.log('Auth callback - Supabase client created');
      
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL("/signin?error=auth", requestUrl.origin));
      }
      
      console.log('Auth callback - Successfully exchanged code for session');
    } catch (error) {
      console.error('Auth callback error:', error);
      if (error instanceof Error) {
        console.error('Auth callback error stack:', error.stack);
      }
      return NextResponse.redirect(new URL("/signin?error=auth", requestUrl.origin));
    }
  }

  // Always redirect to home page after auth callback
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}