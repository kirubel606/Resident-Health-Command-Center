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
import { CarePlanForm } from "@/features/care-plans/components/CarePlanForm";
import type { Patient } from "@/features/patients";

export function QueueTable() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    (patient) => statusFilter === "all" || patient.status === statusFilter
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

  if (loading) {
    return <div className="p-4 text-center">Loading queue...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
        <Button variant={statusFilter === "waiting" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("waiting")}>Waiting</Button>
        <Button variant={statusFilter === "in-progress" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in-progress")}>In Progress</Button>
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
                      <Dialog>
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
                          <CarePlanForm patientId={patient.id} />
                        </DialogContent>
                      </Dialog>
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
