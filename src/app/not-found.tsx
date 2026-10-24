import Link from "next/link";
import { EmptyState } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="print-page">
      <div className="card">
        <EmptyState
          title="This page could not be found"
          description="Check the address or return to your demonstration workspace."
          action={
            <Button asChild>
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    </main>
  );
}
