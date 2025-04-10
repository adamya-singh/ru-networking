"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraduationCap, BookOpen, Heart, Target, User, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  graduation_year: z.number().min(currentYear).max(currentYear + 6),
  major: z.string().min(1, "Major is required"),
  minor: z.string().optional(),
  interests: z.string().min(1, "Interests are required"),
  professional_aspirations: z
	.string()
	.min(1, "Professional aspirations are required"),
  bio: z
	.string()
	.min(1, "Bio is required")
	.max(500, "Bio must be less than 500 characters"),
});

// Sample completed courses data (matching find-classmates page)
const completedCourses = [
  {
	id: "cs111",
	name: "CS 111 - Introduction to Computer Science",
	professor: "Paula Centeno",
	term: "Fall 2023",
  },
  {
	id: "cs436",
	name: "Intro Data Science",
	professor: "Dr. Michael Chen",
	term: "Fall 2023",
  },
  {
	id: "cs206",
	name: "Intro To Discrete Structures II",
	professor: "Dr. Hamidi",
	term: "Spring 2024",
  },
  {
	id: "S101",
	name: "Stats 1",
	professor: "Dr. Emily White",
	term: "Spring 2024",
  },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
  	if (user?.id) {
    	const { data: profile } = await supabase
      	.from("profiles")
      	.select("*")
      	.eq("id", user.id)
      	.single();

    	if (profile) {
      	form.reset(profile);
    	}
  	}
  	setLoading(false);
	};

	loadProfile();
  }, [form, user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
	try {
  	if (!user?.id) {
    	toast.error("Please sign in to update your profile");
    	return;
  	}

  	const { error } = await supabase.from("profiles").upsert({
    	id: user.id,
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
	return (
  	<div className="flex justify-center items-center min-h-screen">
    	Loading...
  	</div>
	);
  }

  return (
	<div className="min-h-screen bg-background">
  	<Header />

  	<main className="container pt-20 pb-4">
    	<div className="flex flex-col lg:flex-row gap-6">
      	{/* Profile Form Section */}
      	<div className="flex-1">
        	<Card>
          	<CardHeader>
            	<div className="flex items-center justify-center mb-6">
              	<GraduationCap className="w-12 h-12 text-primary" />
            	</div>
            	<h1 className="text-3xl font-bold text-center">RU Profile</h1>
            	<p className="text-center text-muted-foreground mt-2">
              	Build your Rutgers network presence
            	</p>
          	</CardHeader>
          	<CardContent>
            	<Form {...form}>
              	<form
                	onSubmit={form.handleSubmit(onSubmit)}
                	className="space-y-6"
              	>
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
                          	<Input
                            	type="number"
                            	{...field}
                            	onChange={(e) =>
                              	field.onChange(parseInt(e.target.value))
                            	}
                          	/>
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
                  	<FormField
                    	control={form.control}
                    	name="minor"
                    	render={({ field }) => (
                      	<FormItem>
                        	<FormLabel className="flex items-center gap-2">
                          	<BookOpen className="w-4 h-4" />
                          	Minor
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
                          	<Input {...field} />
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
                          	<Input {...field} />
                        	</FormControl>
                        	<FormMessage />
                      	</FormItem>
                    	)}
                  	/>
                  	<FormField
                    	control={form.control}
                    	name="bio"
                    	render={({ field }) => (
                      	<FormItem className="col-span-2">
                        	<FormLabel className="flex items-center gap-2">
                          	<User className="w-4 h-4" />
                          	Bio
                        	</FormLabel>
                        	<FormControl>
                          	<Textarea
                            	{...field}
                            	className="min-h-[100px]"
                          	/>
                        	</FormControl>
                        	<FormMessage />
                      	</FormItem>
                    	)}
                  	/>
                	</div>
                	<Button type="submit" className="w-full">
                  	<CheckCircle2 className="w-4 h-4 mr-2" />
                  	Save Profile
                	</Button>
              	</form>
            	</Form>
          	</CardContent>
        	</Card>
      	</div>
    	</div>
  	</main>
  	<Footer />
	</div>
  );
}