"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Copy } from "lucide-react";

export default function SavedSchedulesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Saved Schedules
          </h1>

          {/* Empty State */}
          {true && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No saved schedules yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Your saved course schedules will appear here
                  </p>
                  <Button>Create New Schedule</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Saved Schedule (commented out for now) */}
          {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Fall 2024 Schedule</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                    <div>
                      <h3 className="font-medium">CS 111 - Introduction to Computer Science</h3>
                      <p className="text-sm text-muted-foreground">Mon, Wed • 10:00-11:20 • 4 credits</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                    <div>
                      <h3 className="font-medium">MATH 151 - Calculus I</h3>
                      <p className="text-sm text-muted-foreground">Tue, Thu • 13:00-14:20 • 4 credits</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}