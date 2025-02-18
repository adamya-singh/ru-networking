"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Users, Instagram, Mail, BookOpen } from "lucide-react";

// Sample class data with students
const classesData = [
  {
    id: "cs111",
    name: "CS 111 - Introduction to Computer Science",
    professor: "Paula Centeno",
    schedule: "Mon, Wed • 10:00-11:20 AM",
    students: [
      { name: "Alex Thompson", instagram: "@alex_codes", email: "alex.t@rutgers.edu" },
      { name: "Maria Garcia", instagram: "@maria_g", email: "maria.g@rutgers.edu" },
      { name: "James Wilson", instagram: "@jwilson", email: "j.wilson@rutgers.edu" },
      // ... add more students to reach 20
    ],
  },
  {
    id: "cs436",
    name: "Intro Data Science",
    professor: "Dr. Michael Chen",
    schedule: "Tue, Thu • 2:00-3:20 PM",
    students: [
      { name: "Emma Davis", instagram: "@emma_dev", email: "emma.d@rutgers.edu" },
      { name: "Lucas Brown", instagram: "@lucas.codes", email: "lucas.b@rutgers.edu" },
      { name: "Sophia Lee", instagram: "@sophialee", email: "sophia.l@rutgers.edu" },
      // ... add more students to reach 20
    ],
  },
  {
    id: "cs206",
    name: "Intro To Discrete Structures II",
    professor: "Dr. Hamidi",
    schedule: "Mon, Wed • 1:00-2:20 PM",
    students: [
      { name: "Oliver Martinez", instagram: "@oli_tech", email: "oliver.m@rutgers.edu" },
      { name: "Ava Wilson", instagram: "@ava_w", email: "ava.w@rutgers.edu" },
      { name: "Ethan Clark", instagram: "@ethan_c", email: "ethan.c@rutgers.edu" },
      // ... add more students to reach 20
    ],
  },
  {
    id: "S101",
    name: "Stats 1",
    professor: "Dr. Emily White",
    schedule: "Tue • 9:00-10:30 AM",
    students: [
      { name: "Isabella Kim", instagram: "@bella_codes", email: "isabella.k@rutgers.edu" },
      { name: "William Chen", instagram: "@will_chen", email: "william.c@rutgers.edu" },
      { name: "Sofia Rodriguez", instagram: "@sofia_r", email: "sofia.r@rutgers.edu" },
      // ... add more students to reach 20
    ],
  },
  {
    id: "cs440",
    name: "CS 440 - Introduction to Artificial Intelligence",
    professor: "Dr. David Park",
    schedule: "Mon, Wed • 3:30-4:50 PM",
    students: [
      { name: "Noah Anderson", instagram: "@noah_ai", email: "noah.a@rutgers.edu" },
      { name: "Mia Patel", instagram: "@mia_codes", email: "mia.p@rutgers.edu" },
      { name: "Liam Johnson", instagram: "@liam_j", email: "liam.j@rutgers.edu" },
      // ... add more students to reach 20
    ],
  },
];

// Generate more random students for each class
const generateMoreStudents = (baseStudents: any[]) => {
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Daniel", "Lisa", "Kevin", "Rachel", "Chris", "Amanda", "Ryan", "Jessica", "Andrew", "Michelle", "Steven"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor"];

  const additionalStudents = Array.from({ length: 17 }, () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const instagramHandle = `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@rutgers.edu`;

    return {
      name: `${firstName} ${lastName}`,
      instagram: instagramHandle,
      email: email,
    };
  });

  return [...baseStudents, ...additionalStudents];
};

// Add more students to each class
classesData.forEach(classItem => {
  classItem.students = generateMoreStudents(classItem.students);
});

export default function FindClassmatesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Find Classmates</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {classesData.map((classItem) => (
                  <AccordionItem key={classItem.id} value={classItem.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{classItem.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {classItem.professor} • {classItem.schedule}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        {classItem.students.map((student, index) => (
                          <HoverCard key={`${classItem.id}-${index}`}>
                            <HoverCardTrigger className="text-left p-2 rounded-lg hover:bg-accent transition-colors">
                              {student.name}
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold">{student.name}</h4>
                                  <div className="flex items-center pt-2">
                                    <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                                    <span className="text-sm text-muted-foreground">
                                      {student.instagram}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm text-muted-foreground">
                                      {student.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}