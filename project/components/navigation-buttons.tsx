"use client";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/components/providers";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AuthButtons() {
  return (
    <>
      <Link href="/signin">
        <Button variant="ghost" className="text-foreground">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-scarlet hover:bg-scarlet/90">
          Sign Up
        </Button>
      </Link>
    </>
  );
}

export function NavigationButtons() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {pathname === "/" ? <AuthButtons /> : <UserMenu />}
    </div>
  );
}