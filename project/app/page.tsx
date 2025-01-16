import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <GraduationCap className="h-12 w-12 text-scarlet" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Rutgers Course Planner
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Plan your academic journey with ease. Create your perfect schedule, manage your courses,
              and stay organized throughout your semester at Rutgers University.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/schedule">
                <Button size="lg" className="bg-scarlet hover:bg-scarlet/90 gap-2">
                  Start Planning <ArrowRight className="h-4 w-4" />
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
            <h2 className="text-base font-semibold leading-7 text-scarlet">Course Planning Made Easy</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to plan your semester
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-scarlet">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-auto flex-col">
                    <h3 className="text-lg font-semibold leading-8 text-foreground">{feature.name}</h3>
                    <p className="mt-1 flex flex-auto text-base leading-7 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Visual Schedule Builder',
    description: 'Drag and drop interface to build your perfect schedule. Visualize your weekly calendar and avoid time conflicts.',
    icon: Calendar,
  },
  {
    name: 'Course Requirements Tracking',
    description: 'Keep track of your major requirements and progress towards your degree with our smart tracking system.',
    icon: GraduationCap,
  },
  {
    name: 'Real-time Availability',
    description: 'Get instant updates on course availability and waitlist status to make informed decisions.',
    icon: ArrowRight,
  },
];