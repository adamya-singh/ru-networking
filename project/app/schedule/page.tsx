"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, BookMarked, X, Clock, MessageSquare, Trash2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Chat from "@/components/chat";
import WeeklySchedule from "@/components/weekly-schedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeetingTime {
  meetingday: string;
  starttime: string;
  endtime: string;
  roomnumber: string;
  buildingcode: string;
  campusname: string;
  meetingmodedesc: string;
}

interface Section {
  id: number;
  number: string;
  indexnumber: string;
  openstatus: boolean;
  instructorstext: string;
  meetingtimes: MeetingTime[];
}

interface ScheduledCourse {
  courseId: string;
  title: string;
  meetingTimes: {
    meetingday: string;
    starttime: string;
    endtime: string;
    roomnumber: string;
    buildingcode: string;
    campusname: string;
    meetingmodedesc: string;
  }[];
  color: string;
  indexnumber: string;
}

interface SupabaseCourse {
  id: number;
  title?: string;
  coursestring?: string;
  credits?: number;
  courseDescription?: string;
  schoolDescription?: string;
  subject?: string;
  subjectdescription?: string;
  [key: string]: any;
}

interface SubjectOption {
  subject: string;
  description: string;
}

export default function SchedulePage() {
  const [selectedCourses, setSelectedCourses] = useState<ScheduledCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SupabaseCourse[]>([]);
  const [selectedCourseForSections, setSelectedCourseForSections] = useState<SupabaseCourse | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const colors = [
    'bg-blue-900/30',
    'bg-green-900/30',
    'bg-orange-900/30',
    'bg-red-900/30',
    'bg-purple-900/30',
    'bg-pink-900/30',
    'bg-yellow-900/30',
    'bg-indigo-900/30',
  ];

  useEffect(() => {
    console.log('Selected courses updated:', selectedCourses);
  }, [selectedCourses]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const pageSize = 1000;
      const subjectMap = new Map<string, string>();
      let hasMore = true;
      let start = 0;
      
      while (hasMore) {
        console.log(`Fetching subjects from ${start} to ${start + pageSize - 1}...`);
        
        const { data, error } = await supabase
          .from("courses")
          .select("subject, subjectdescription")
          .not("subject", "is", null)
          .order("subject")
          .range(start, start + pageSize - 1);
        
        if (error) {
          console.error("Error fetching subjects:", error);
          break;
        }
        
        if (!data || data.length === 0) {
          hasMore = false;
          break;
        }
        
        // Add subjects and descriptions to the map
        data.forEach(course => {
          if (course.subject) {
            subjectMap.set(course.subject, course.subjectdescription || '');
          }
        });
        
        console.log(`Fetched ${data.length} subjects, total unique so far: ${subjectMap.size}`);
        
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          start += pageSize;
        }
      }
      
      // Convert map to array of objects
      const uniqueSubjects = Array.from(subjectMap.entries()).map(([subject, description]) => ({
        subject,
        description
      }));
      
      console.log("Total unique subjects:", uniqueSubjects.length);
      console.log("Unique subjects with descriptions:", uniqueSubjects);
      
      setSubjects(uniqueSubjects);
    };
    
    fetchSubjects();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [selectedSubject]);

  const fetchSections = async (courseId: number) => {
    const { data: sectionsData, error: sectionsError } = await supabase
      .from("sections")
      .select(`
        id,
        number,
        indexnumber,
        openstatus,
        instructorstext
      `)
      .eq("course_id", courseId);

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError);
      return;
    }

    const sectionsWithMeetingTimes = await Promise.all(
      (sectionsData || []).map(async (section) => {
        const { data: meetingTimesData, error: meetingTimesError } = await supabase
          .from("meetingtimes")
          .select(`
            meetingday,
            starttime,
            endtime,
            roomnumber,
            buildingcode,
            campusname,
            meetingmodedesc
          `)
          .eq("section_id", section.id);

        if (meetingTimesError) {
          console.error("Error fetching meeting times:", meetingTimesError);
          return { ...section, meetingtimes: [] };
        }

        return {
          ...section,
          meetingtimes: meetingTimesData || []
        };
      })
    );

    setSections(sectionsWithMeetingTimes);
    setSelectedCourseForSections(searchResults.find(course => course.id === courseId) || null);
  };

  const addCourse = (course: SupabaseCourse, section: Section) => {
    console.log('Adding course with data:', { course, section });
    
    const color = colors[selectedCourses.length % colors.length];
    
    setSelectedCourses((prev) => {
      const newCourses = [
        ...prev,
        {
          courseId: String(course.id),
          title: course.title || '',
          meetingTimes: section.meetingtimes,
          color,
          indexnumber: section.indexnumber,
        },
      ];
      return newCourses;
    });

    setSelectedCourseForSections(null);
    setSections([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedSubject) {
      setSearchResults([]);
      return;
    }

    let query = supabase
      .from("courses")
      .select("*");
    
    if (searchQuery.trim()) {
      query = query.ilike("title", `%${searchQuery}%`);
    }
    
    if (selectedSubject) {
      query = query.eq("subject", selectedSubject);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Search error:", error);
      return;
    }

    if (data) {
      setSearchResults(data);
    }
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((course) => course.courseId !== courseId));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container py-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Create Schedule
          </h1>
          <Link href="/saved-schedules">
            <Button variant="outline" className="gap-2">
              <BookMarked className="h-4 w-4" />
              Saved Schedules
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 min-h-[calc(100vh-12rem)]">
          {/* Course Search Section */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="w-full">
                    <Select
                      value={selectedSubject || "all"}
                      onValueChange={(value) => {
                        setSelectedSubject(value === "all" ? null : value);
                        handleSearch();
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subjectOption) => (
                          <SelectItem key={subjectOption.subject} value={subjectOption.subject}>
                            {subjectOption.subject} {subjectOption.description ? `- ${subjectOption.description}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {searchResults.map((course) => (
                    <Card
                      key={course.id}
                      className="p-4 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => fetchSections(course.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{course.title}</h3>
                          <div className="space-y-1 mt-1">
                            <p className="text-sm text-muted-foreground">
                              {course.coursestring} • {course.credits} credits
                            </p>
                            {course.courseDescription && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {course.courseDescription}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {course.schoolDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Section Selection Modal */}
                {selectedCourseForSections && (
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-background border rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Select Section</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCourseForSections(null);
                            setSections([]);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <Card key={section.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div>
                                  <p className="font-medium">Section {section.number}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Index: {section.indexnumber}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {section.instructorstext}
                                  </p>
                                </div>
                                {section.meetingtimes.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      Meeting Times
                                    </p>
                                    {section.meetingtimes.map((time, index) => (
                                      <div key={index} className="text-sm text-muted-foreground pl-5">
                                        <p>{time.meetingday} {time.starttime} - {time.endtime}</p>
                                        <p>{time.buildingcode} {time.roomnumber}</p>
                                        <p>{time.campusname} • {time.meetingmodedesc}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addCourse(selectedCourseForSections, section)}
                                disabled={!section.openstatus}
                              >
                                {section.openstatus ? "Add" : "Closed"}
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Schedule View Section */}
          <div className="lg:col-span-2 space-y-4">
            <WeeklySchedule events={selectedCourses} />
            
            {/* Selected Courses List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCourses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No courses added yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCourses.map((course) => (
                      <div 
                        key={course.courseId} 
                        className="flex justify-between items-center p-3 rounded-md border"
                      >
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">Index: {course.indexnumber}</p>
                          <div className="text-sm text-muted-foreground">
                            {course.meetingTimes.map((time, index) => (
                              <div key={index}>
                                {time.meetingday} {time.starttime}-{time.endtime} • {time.buildingcode} {time.roomnumber} • {time.campusname}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeCourse(course.courseId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button className="w-full" size="lg">
              Register!
            </Button>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Course Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full">
                  <Chat />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

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