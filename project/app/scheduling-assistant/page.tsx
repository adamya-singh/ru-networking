'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import {
  Mic,
  Settings2,
  User,
  LogOut,
  ChevronDown,
  MessageSquare,
  Save,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Download,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi! I'm your academic assistant. How can I help you plan your schedule today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);

    const userMessage = inputValue; //save the user's input before clearing input field
    setInputValue(''); //clear the input field

    try {
        //send user message to backend
        const res = await fetch('/api/rag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await res.json();

        if (data.error) {
            throw new Error(data.error);
        }

        //add assistant response to chat
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                content: data.response,
                sender: 'bot',
                timestamp: new Date(),
            },
        ]);
    }   catch (error) {
        console.error('Error fetching assistant response:', error);
    }

  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">RUNetworking</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Find Classmates</Button>
            <Button variant="ghost">Help</Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pt-20 pb-4 flex gap-4 h-[calc(100vh-1rem)]">
        {/* Left Sidebar */}
        <aside className="w-64 hidden lg:block">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Term Selection</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall2025">Fall 2025</SelectItem>
                    <SelectItem value="spring2026">Spring 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class Size Preference</label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Focus Areas</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Major Requirements</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gen-Eds</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Career-Oriented</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Class History</label>
                <ScrollArea className="h-32 rounded-md border p-2">
                  <div className="space-y-1">
                    <p className="text-sm">CS101 - Intro to Computer Science</p>
                    <p className="text-sm">MATH151 - Calculus I</p>
                    <p className="text-sm">ENG101 - English Composition</p>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Chat Section */}
        <section className="flex-1 flex flex-col">
          <Card className="flex-1">
            <CardContent className="p-4 h-full flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ask about courses, requirements, or scheduling..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}>Send</Button>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Sidebar */}
        <aside className="w-72 hidden xl:block">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Quick Course Info</h3>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-3 space-y-2">
                        <h4 className="font-medium">CS{200 + i}</h4>
                        <p className="text-sm text-muted-foreground">
                          Data Structures {i}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">3 credits</span>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 RUNetworking. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Button variant="link" size="sm">
              Course Catalog
            </Button>
            <Button variant="link" size="sm">
              Advising
            </Button>
            <Button variant="link" size="sm">
              Tutoring
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}