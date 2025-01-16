export default function SavedSchedulesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Schedules</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <p className="text-muted-foreground">No saved schedules yet.</p>
        </div>
      </div>
    </div>
  );
}