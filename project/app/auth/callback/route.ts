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
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              cookieStore.set(name, value, options);
            },
            remove(name: string) {
              cookieStore.delete(name);
            },
          },
        }
      );
      
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL("/signin?error=auth", requestUrl.origin));
      }

      // Log user metadata to verify it's being received
      if (session?.user?.user_metadata) {
        console.log('User metadata:', session.user.user_metadata);
      }
      
      // Update user metadata if needed
      if (session?.user) {
        const { data: { user }, error: updateError } = await supabase.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            picture: session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url
          }
        });
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        } else {
          console.log('Successfully updated user metadata:', user?.user_metadata);
        }
      }
      
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