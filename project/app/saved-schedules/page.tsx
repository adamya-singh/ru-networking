"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Eye, Plus, X } from "lucide-react";
import Link from "next/link";
import WeeklySchedule from "@/components/weekly-schedule";

interface Schedule {
  id: string;
  name: string;
  semester: string;
  created_at: string;
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
  sectionId: number;
}

export default function SavedSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleCourses, setScheduleCourses] = useState<ScheduledCourse[]>([]);
  const [showScheduleView, setShowScheduleView] = useState(false);

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
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSchedules(data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async (scheduleId: string) => {
    try {
      // Get the section IDs in this schedule
      const { data: sectionRefs, error: refsError } = await supabase
        .from('schedule_sections')
        .select('section_id')
        .eq('schedule_id', scheduleId);
        
      if (refsError) throw refsError;
      
      const sectionIds = sectionRefs.map(ref => ref.section_id);
      
      // Get the actual section data with meeting times
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          id,
          number,
          indexnumber,
          course_id,
          instructorstext,
          meetingtimes:meetingtimes(
            meetingday,
            starttime,
            endtime,
            roomnumber,
            buildingcode,
            campusname,
            meetingmodedesc
          )
        `)
        .in('id', sectionIds);
        
      if (sectionsError) throw sectionsError;
      
      // Get course information for each section
      const coursesNeeded = Array.from(new Set(sections.map(section => section.course_id)));
      
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', coursesNeeded);
        
      if (coursesError) throw coursesError;
      
      // Convert to ScheduledCourse format
      const scheduledCourses = sections.map((section, index) => {
        const course = courses.find(c => c.id === section.course_id);
        if (!course) {
          console.error(`Course not found for section ${section.id}`);
          return null;
        }

        // Format meeting times to match the expected structure
        const meetingTimes = section.meetingtimes.map(time => ({
          meetingday: time.meetingday,
          starttime: time.starttime,
          endtime: time.endtime,
          roomnumber: time.roomnumber,
          buildingcode: time.buildingcode,
          campusname: time.campusname,
          meetingmodedesc: time.meetingmodedesc
        }));

        return {
          courseId: String(course.id),
          title: course.title || '',
          meetingTimes: meetingTimes,
          color: colors[index % colors.length],
          indexnumber: section.indexnumber,
          sectionId: section.id
        };
      }).filter(Boolean) as ScheduledCourse[];
      
      console.log('Loaded schedule courses:', scheduledCourses);
      setScheduleCourses(scheduledCourses);
      setShowScheduleView(true);
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);
        
      if (error) throw error;
      
      setSchedules(schedules.filter(s => s.id !== scheduleId));
      if (selectedSchedule?.id === scheduleId) {
        setSelectedSchedule(null);
        setShowScheduleView(false);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Saved Schedules
            </h1>
            <Link href="/schedule">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Schedule
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : schedules.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No saved schedules yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Your saved course schedules will appear here
                  </p>
                  <Link href="/schedule">
                    <Button>Create New Schedule</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {schedules.map(schedule => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{schedule.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            loadSchedule(schedule.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{schedule.semester}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Created on {new Date(schedule.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Schedule View Modal */}
          {showScheduleView && selectedSchedule && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-background border rounded-lg shadow-lg max-w-4xl w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedSchedule.name}</h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowScheduleView(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <WeeklySchedule events={scheduleCourses} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}