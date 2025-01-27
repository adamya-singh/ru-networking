"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Chrome } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured. Please connect your Supabase project first.");
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error?.message || error);
      setError(error?.message || "Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
              {error}
            </div>
          )}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2"
          >
            <Chrome className="h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
