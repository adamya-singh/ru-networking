'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface ScheduleEvent {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  color: string;
}

interface DaySchedule {
  day: string;
  events: ScheduleEvent[];
}

interface WeeklyScheduleProps {
  events: {
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
  }[];
}

const DAY_MAP: { [key: string]: string } = {
  'M': 'Monday',
  'T': 'Tuesday',
  'W': 'Wednesday',
  'H': 'Thursday',
  'F': 'Friday',
};

const formatTime = (time: string): string => {
  // Convert "0200" to "2:00 PM" or "1020" to "10:20 AM"
  const hour = parseInt(time.slice(0, 2));
  const minute = time.slice(2);
  
  // Determine if it's afternoon based on the class schedule context
  // Most university classes between 12:00 PM and 8:00 PM
  const isAfternoon = hour >= 1 && hour <= 8;
  
  const adjustedHour = isAfternoon ? hour + 12 : hour;
  const period = adjustedHour >= 12 ? 'PM' : 'AM';
  const hour12 = adjustedHour > 12 ? adjustedHour - 12 : adjustedHour === 0 ? 12 : adjustedHour;
  
  return `${hour12}:${minute} ${period}`;
};

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
];

const WeeklySchedule = ({ events }: WeeklyScheduleProps) => {
  // Transform events into day schedule format
  const schedule: DaySchedule[] = [
    { day: 'Monday', events: [] },
    { day: 'Tuesday', events: [] },
    { day: 'Wednesday', events: [] },
    { day: 'Thursday', events: [] },
    { day: 'Friday', events: [] },
  ];

  // Process events into schedule
  events.forEach((courseEvent) => {
    courseEvent.meetingTimes.forEach((meeting) => {
      const dayName = DAY_MAP[meeting.meetingday];
      const daySchedule = schedule.find(
        (day) => day.day === dayName
      );
      
      if (daySchedule) {
        daySchedule.events.push({
          title: courseEvent.title,
          startTime: formatTime(meeting.starttime),
          endTime: formatTime(meeting.endtime),
          location: `${meeting.buildingcode} ${meeting.roomnumber}`,
          color: courseEvent.color,
        });
      }
    });
  });

  const convertTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  const getEventPosition = (startTime: string) => {
    const startMinutes = convertTimeToMinutes(startTime);
    const scheduleStartMinutes = convertTimeToMinutes('8:00 AM');
    return startMinutes - scheduleStartMinutes;
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    return endMinutes - startMinutes;
  };

  const MINUTES_PER_PIXEL = 0.5; // 2 pixels per minute
  const CELL_HEIGHT = 64; // h-16 = 64px
  const HOUR_HEIGHT = CELL_HEIGHT;

  return (
    <Card className="p-4 w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border">
          <div className="p-2 font-semibold text-muted-foreground"></div>
          {schedule.map((day) => (
            <div key={day.day} className="p-2 font-semibold text-foreground text-center border-l border-border">
              {day.day}
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="grid grid-cols-[100px_repeat(5,1fr)]">
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="h-16 border-b border-border p-2 text-sm text-muted-foreground">{time}</div>
                {schedule.map((day) => (
                  <div key={`${day.day}-${time}`} className="h-16 border-b border-l border-border"></div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="absolute top-0 left-[100px] right-0 h-full grid grid-cols-5">
            {schedule.map((day, dayIndex) => (
              <div key={day.day} className="relative">
                {day.events.map((event, eventIndex) => {
                  const startMinutes = getEventPosition(event.startTime);
                  const durationMinutes = getEventHeight(event.startTime, event.endTime);
                  const top = (startMinutes / 60) * HOUR_HEIGHT;
                  const height = (durationMinutes / 60) * HOUR_HEIGHT;
                  
                  return (
                    <div
                      key={`${event.title}-${eventIndex}`}
                      className={`absolute w-[95%] left-[2.5%] rounded-md p-2 border border-border ${event.color}`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="text-xs font-semibold text-foreground">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklySchedule;