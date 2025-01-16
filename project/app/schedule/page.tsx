"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Calendar } from "lucide-react";

export default function SchedulePage() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addCourse = (course: Course) => {
    setSelectedCourses((prev) => [...prev, course]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Course Search Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Search Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {sampleCourses.map((course) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{course.code}</h3>
                        <p className="text-sm text-muted-foreground">{course.name}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => addCourse(course)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule View Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-1"></div>
                {days.map((day) => (
                  <div key={day} className="text-center font-medium">
                    {day}
                  </div>
                ))}
                {hours.map((hour) => (
                  <div key={`row-${hour}`} className="contents">
                    <div className="text-right text-sm text-muted-foreground">
                      {hour}:00
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${day}-${hour}`}
                        className="h-12 border-t border-border"
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

const sampleCourses: Course[] = [
  {
    id: "1",
    code: "CS 111",
    name: "Introduction to Computer Science",
    credits: 4,
    schedule: {
      days: ["Mon", "Wed"],
      startTime: "10:00",
      endTime: "11:20",
    },
  },
  {
    id: "2",
    code: "MATH 151",
    name: "Calculus I",
    credits: 4,
    schedule: {
      days: ["Tue", "Thu"],
      startTime: "13:00",
      endTime: "14:20",
    },
  },
  {
    id: "3",
    code: "PHYS 123",
    name: "Physics I",
    credits: 3,
    schedule: {
      days: ["Mon", "Wed", "Fri"],
      startTime: "14:00",
      endTime: "14:50",
    },
  },
];