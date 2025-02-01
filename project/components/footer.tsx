"use client";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
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
  );
}