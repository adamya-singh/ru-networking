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

const schedule: DaySchedule[] = [
  {
    day: 'Monday',
    events: [
      {
        title: 'INTR DISCRT STRCT II',
        startTime: '2:00 PM',
        endTime: '3:20 PM',
        location: '01:198:206:06:10582',
        color: 'bg-blue-900/30',
      },
      {
        title: 'INTR DISCRT STRCT II',
        startTime: '5:55 PM',
        endTime: '6:50 PM',
        location: '01:198:206:06:10582',
        color: 'bg-blue-900/30',
      },
    ],
  },
  {
    day: 'Tuesday',
    events: [
      {
        title: 'MORNING LECTURE',
        startTime: '9:00 AM',
        endTime: '10:30 AM',
        location: '01:198:436:08:22349',
        color: 'bg-green-900/30',
      },
      {
        title: 'INTRO DATA SCIENCE',
        startTime: '2:00 PM',
        endTime: '3:20 PM',
        location: '01:198:436:08:22349',
        color: 'bg-orange-900/30',
      },
      {
        title: 'INTRO COMP SCI',
        startTime: '5:40 PM',
        endTime: '7:00 PM',
        location: '01:640:250:C1:12110',
        color: 'bg-red-900/30',
      },
    ],
  },
  {
    day: 'Wednesday',
    events: [
      {
        title: 'INTR DISCRT STRCT II',
        startTime: '2:00 PM',
        endTime: '3:20 PM',
        location: '01:198:206:06:10582',
        color: 'bg-blue-900/30',
      },
    ],
  },
  {
    day: 'Thursday',
    events: [
      {
        title: 'INTRO COMP SCI',
        startTime: '10:35 AM',
        endTime: '11:30 AM',
        //location: '01:640:250:C1:12110',
        color: 'bg-red-900/30',
      },
      {
        title: 'INTRO DATA SCIENCE',
        startTime: '2:00 PM',
        endTime: '3:20 PM',
        location: '01:198:436:08:22349',
        color: 'bg-orange-900/30',
      },
      {
        title: 'INTRO COMP SCI',
        startTime: '5:40 PM',
        endTime: '7:00 PM',
        location: '01:640:250:C1:12110',
        color: 'bg-red-900/30',
      },
    ],
  },
  {
    day: 'Friday',
    events: [],
  },
];

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
];

const WeeklySchedule = () => {
  const convertTimeToMinutes = (timeStr: string) => {
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