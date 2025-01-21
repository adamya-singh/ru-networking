'use client';

import { useState } from 'react';
import { Search, Calendar, BookOpen, GraduationCap, User, Save, HelpCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function SchedulingAssistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleAskQuestion = () => {
    // Placeholder for AI interaction
    setResponse('This is a sample response. In production, this would be connected to your AI backend.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-primary mb-2">AI-Powered Scheduling Assistant</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Ask detailed questions about courses, get recommendations tailored to your goals, and simplify your semester planning.
          </p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="What courses fulfill my major requirements for Computer Science?"
              className="pl-10 pr-4 h-12"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Main Content */}
        <main className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall2024">Fall 2024</SelectItem>
                      <SelectItem value="spring2025">Spring 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAskQuestion}>
                  Ask the Assistant
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {response ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{response}</p>
                    {/* Sample Course Recommendation */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">CS 111: Introduction to Computer Science</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              An introduction to programming methodology and problem solving using Java.
                            </p>
                            <p className="text-sm mt-2">Credits: 4 | Schedule: MW 10:00-11:20</p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              Add to Schedule
                            </Button>
                            <Button variant="secondary" size="sm">
                              View Similar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Ask a question to see recommendations
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>

        {/* Sidebar */}
        <aside className="w-80 shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5" />
                <p className="font-semibold">Welcome, Student!</p>
              </div>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> Saved Schedules
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" /> View Degree Progress
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" /> Explore Career Pathways
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold">Personalization</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Interests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">Artificial Intelligence</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Button variant="link" className="text-muted-foreground">
              <HelpCircle className="mr-2 h-4 w-4" />
              Need help? Contact us
            </Button>
            <p className="text-sm text-muted-foreground">
              Course information is up-to-date as of April 2024, but please verify with official Rutgers resources.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}