"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type CreateCarePlanInput, CreateCarePlanSchema } from "../schemas";

export function CarePlanForm({
  patientId,
  onSuccess,
}: {
  patientId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<CreateCarePlanInput>({
    resolver: zodResolver(CreateCarePlanSchema),
    defaultValues: {
      patientId,
      notes: "",
      prescriptions: "",
      followUpDate: "",
    },
  });

  async function onSubmit(values: CreateCarePlanInput) {
    try {
      const response = await fetch("/api/care-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create care plan");
      }

      toast.success("Care plan created");
      form.reset({ ...form.getValues(), notes: "", prescriptions: "", followUpDate: "" });
      onSuccess?.();
    } catch (_error) {
      toast.error("Error creating care plan");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter clinical observations..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prescriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescriptions</FormLabel>
              <FormControl>
                <Input placeholder="Medications, dosage, frequency..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="followUpDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Care Plan"}
        </Button>
      </form>
    </Form>
  );
}
