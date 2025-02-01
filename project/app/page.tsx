"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1">
        <div className="px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Connect with Your Rutgers Community
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Build meaningful connections, find study partners, and engage with fellow students
                who share your academic interests and career goals.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/assistant">
                  <Button size="lg" className="gap-2">
                    Get Started <Users className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-muted py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">RU Networking</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to thrive at Rutgers
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex flex-auto flex-col">
                      <h3 className="text-lg font-semibold leading-8 text-foreground">
                        {feature.name}
                      </h3>
                      <p className="mt-1 flex flex-auto text-base leading-7 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const features = [
  {
    name: "Student Networking",
    description:
      "Connect with classmates, join study groups, and build your professional network within the Rutgers community.",
    icon: Users,
  },
  {
    name: "Academic Success",
    description:
      "Find study partners, share resources, and collaborate with peers in your major to excel in your courses.",
    icon: GraduationCap,
  },
  {
    name: "Course Discussions",
    description:
      "Engage in meaningful discussions about courses, share experiences, and get insights from fellow students.",
    icon: BookOpen,
  },
];