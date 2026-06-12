"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CarePlanForm } from "@/features/care-plans/components/CarePlanForm";
import type { Patient } from "@/features/patients";
import { flags } from "@/core/config/flags";

export function QueueTable() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [reminding, setReminding] = useState<Record<string, boolean>>({});
  const [isCarePlanOpen, setIsCarePlanOpen] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const response = await fetch("/api/queue");
      if (!response.ok) {
        throw new Error("Failed to fetch queue");
      }
      const data = await response.json();
      setQueue(data);
    } catch (_error) {
      toast.error("Error fetching queue");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredQueue = queue.filter(
    (patient) => 
      (statusFilter === "all" || patient.status === statusFilter) &&
      (patient.name.toLowerCase().includes(search.toLowerCase()) || patient.symptoms.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => b.priorityScore - a.priorityScore);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  async function handleAdvance(id: string) {
    try {
      const response = await fetch(`/api/queue/${id}/advance`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to advance patient");
      }

      toast.success("Patient advanced");
      fetchQueue();
    } catch (_error) {
      toast.error("Error advancing patient");
    }
  }

  async function handleRemind(id: string) {
    setReminding((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/patients/${id}/remind`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to send reminder");
      }

      toast.success("Reminder sent");
    } catch (_error) {
      toast.error("Error sending reminder");
    } finally {
      setReminding((prev) => ({ ...prev, [id]: false }));
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading queue...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
        <Button variant={statusFilter === "waiting" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("waiting")}>Waiting</Button>
        <Button variant={statusFilter === "in-progress" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in-progress")}>In Progress</Button>
        <Input 
            placeholder="Search patients or symptoms..." 
            className="max-w-xs" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Symptoms</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQueue.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No patients match filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredQueue.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div>
                      {patient.name}
                      <div className="text-[10px] text-muted-foreground uppercase">
                        {patient.status}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.status === "in-progress" ? "default" : "secondary"}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.priorityScore > 7
                          ? "destructive"
                          : patient.priorityScore > 4
                            ? "default"
                            : "outline"
                      }
                    >
                      {patient.priorityScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate text-xs">{patient.symptoms}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {patient.status === "in-progress" && (
                      <Dialog open={isCarePlanOpen} onOpenChange={setIsCarePlanOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Care Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Care Plan for {patient.name}</DialogTitle>
                            <DialogDescription>
                              Record clinical notes and prescriptions.
                            </DialogDescription>
                          </DialogHeader>
                          <CarePlanForm patientId={patient.id} onSuccess={() => setIsCarePlanOpen(false)} />
                        </DialogContent>
                      </Dialog>
                    )}
                    {flags.emailReminders && (
                      <Button size="sm" variant="outline" onClick={() => handleRemind(patient.id)} disabled={reminding[patient.id]}>
                        {reminding[patient.id] ? "Sending..." : "Remind"}
                      </Button>
                    )}
                    <Button size="sm" onClick={() => handleAdvance(patient.id)}>
                      {patient.status === "waiting" ? "Start" : "Complete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
