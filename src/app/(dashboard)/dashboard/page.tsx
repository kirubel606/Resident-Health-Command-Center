import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/features/auth/service";
import { PatientRegistrationForm } from "@/features/patients/components/PatientRegistrationForm";
import { QueueTable } from "@/features/queue/components/QueueTable";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Clinical Command Center</h1>
        <p className="text-muted-foreground">Manage patient intake and care queue.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Registration</CardTitle>
            <CardDescription>Enter details for a new patient intake.</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientRegistrationForm />
          </CardContent>
        </Card>

        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Live Queue</CardTitle>
            <CardDescription>Current patients waiting or in treatment.</CardDescription>
          </CardHeader>
          <CardContent>
            <QueueTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Authenticated as {user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Last Sign In</dt>
                <dd>
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono text-[10px]">{user?.id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
