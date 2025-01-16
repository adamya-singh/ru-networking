"use client";

import { User, LogOut, Calendar, BookMarked } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function UserMenu({ isSignedIn = false }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isSignedIn ? (
          <>
            <Link href="/schedule">
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Course Schedule</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/saved-schedules">
              <DropdownMenuItem>
                <BookMarked className="mr-2 h-4 w-4" />
                <span>Saved Schedules</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <Link href="/signin">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}