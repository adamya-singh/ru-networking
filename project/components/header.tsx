"use client";

import Link from "next/link";
import { MessageSquare, Settings2, LogOut, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/themetoggle";
import { useAuth } from "@/components/providers";
import { useEffect } from "react";

export function Header() {
  const { user, signOut, loading } = useAuth();
  const userAvatar = user?.user_metadata?.picture || null;
  const userEmail = user?.email || null;
  const isAuthenticated = !!user;

  // Add debug logging
  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      console.log('User metadata:', user.user_metadata);
      console.log('Profile picture URL:', userAvatar);
    }
  }, [user, userAvatar]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">RUNetworking</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/assistant">
            <Button variant="ghost">Assistant</Button>
          </Link>
          <Link href="/schedule">
            <Button variant="ghost" className="gap-2">
              <Calendar className="h-4 w-4" />
              Create Schedule
            </Button>
          </Link>
          <Link href="/find-classmates">
            <Button variant="ghost">Find Classmates</Button>
          </Link>

          <Button variant="ghost">Help</Button>
          <ThemeToggle />
        </nav>
        {loading ? (
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4 animate-pulse" />
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={userEmail || "User avatar"} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
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
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signin">
            <Button variant="default">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}