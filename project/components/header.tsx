"use client";

import Link from "next/link";
import { MessageSquare, Settings2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/themetoggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">RUNetworking</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/scheduling-assistant">
            <Button variant="ghost">Assistant</Button>
          </Link>
          <Button variant="ghost">Find Classmates</Button>
          <Button variant="ghost">Help</Button>
          <ThemeToggle />
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
            <Link href="/update-profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Update Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}