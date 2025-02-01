'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ThemeToggle from '@/components/themetoggle';
import { Header } from "@/components/header";
import Link from "next/link";
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

// 2. Import your Chat component
import Chat from '../../components/chat'; // <-- Adjust the path as needed

export default function Home() {


  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container pt-20 pb-4 flex gap-4 h-[calc(100vh-4rem)] overflow-hidden">
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
        <section className="flex-1 flex flex-col h-full overflow-hidden">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col overflow-hidden">
              {/* Just drop in your Chat component. That’s it! */}
              <Chat />
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