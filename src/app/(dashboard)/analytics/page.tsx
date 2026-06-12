import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/core/database/client";
import { patients } from "@/core/database/schema";
import { count, eq } from "drizzle-orm";
import { PatientStatusChart } from "@/features/queue/components/PatientStatusChart";
import { getAllPatients } from "@/features/patients";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // Fetch patient data and counts
  const allPatients = await getAllPatients();
  const totalPatients = await db.select({ count: count() }).from(patients);
  const waitingPatients = await db.select({ count: count() }).from(patients).where(eq(patients.status, "waiting"));
  const inProgressPatients = await db.select({ count: count() }).from(patients).where(eq(patients.status, "in-progress"));
  const completedPatients = await db.select({ count: count() }).from(patients).where(eq(patients.status, "completed"));

  const stats = [
    { title: "Total Patients", value: totalPatients[0].count },
    { title: "Waiting", value: waitingPatients[0].count },
    { title: "In-Progress", value: inProgressPatients[0].count },
    { title: "Completed", value: completedPatients[0].count },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">System Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PatientStatusChart patients={allPatients} />
    </div>
  );
}
