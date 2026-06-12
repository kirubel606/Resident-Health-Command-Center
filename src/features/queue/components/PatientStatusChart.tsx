import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Patient } from "@/features/patients";

export function PatientStatusChart({ patients }: { patients: Patient[] }) {
  const counts = patients.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    { waiting: 0, "in-progress": 0, completed: 0 } as Record<string, number>
  );

  const total = patients.length || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-8 w-full overflow-hidden rounded-md border">
          <div
            style={{ width: `${(counts.waiting / total) * 100}%` }}
            className="bg-secondary"
            title={`Waiting: ${counts.waiting}`}
          />
          <div
            style={{ width: `${(counts["in-progress"] / total) * 100}%` }}
            className="bg-primary"
            title={`In Progress: ${counts["in-progress"]}`}
          />
          <div
            style={{ width: `${(counts.completed / total) * 100}%` }}
            className="bg-muted-foreground"
            title={`Completed: ${counts.completed}`}
          />
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            Waiting ({counts.waiting})
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            In Progress ({counts["in-progress"]})
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            Completed ({counts.completed})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
