"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { GoogleLogo } from "@/components/ui/google-logo";

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
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error?.message || error);
      setError(error?.message || "Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Welcome to RUNetworking</CardTitle>
              <CardDescription className="text-center">
                Connect with your Rutgers community and build meaningful academic relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md"
                >
                  {error}
                </motion.div>
              )}
              <div className="text-sm text-muted-foreground text-center">
                <p className="flex items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Please use your Rutgers email address to sign in
                </p>
              </div>
              <Button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 h-12 text-base bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                size="lg"
              >
                <GoogleLogo />
                Continue with Google
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}