"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraduationCap, BookOpen, Heart, Target, User } from "lucide-react";

import { Header } from "@/components/header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const currentYear = new Date().getFullYear();
const formSchema = z.object({
  graduation_year: z.number().min(currentYear).max(currentYear + 6),
  major: z.string().min(1, "Major is required"),
  minor: z.string().optional(),
  interests: z.string().min(1, "Interests are required"),
  professional_aspirations: z.string().min(1, "Professional aspirations are required"),
  bio: z.string().min(1, "Bio is required").max(500, "Bio must be less than 500 characters"),
});

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      graduation_year: currentYear,
      major: "",
      minor: "",
      interests: "",
      professional_aspirations: "",
      bio: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          form.reset(profile);
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [supabase, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Please sign in to update your profile");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          ...values,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container pt-20 pb-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-center">RU Profile</h1>
            <p className="text-center text-muted-foreground mt-2">Build your Rutgers network presence</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="graduation_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Graduation Year
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Major
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="minor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Minor (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Interests
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What are you passionate about?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professional_aspirations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Professional Aspirations
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What are your career goals?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Short Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 RUNetworking. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Button variant="link" size="sm">
              Course Catalog
            </Button>
            <Button variant="link" size="sm">
              Advising
            </Button>
            <Button variant="link" size="sm">
              Tutoring
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}