import type { ReactNode } from "react";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="font-semibold">
              Dashboard
            </a>
            <a href="/analytics" className="text-muted-foreground hover:text-foreground">
              Analytics
            </a>
          </nav>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
