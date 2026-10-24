"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="print-page">
      <div className="card card-body stack" role="alert">
        <h1>The workspace could not load</h1>
        <p>
          Retry this view. Saved local demonstration records have not been
          intentionally changed.
        </p>
        <div className="row">
          <Button onClick={reset}>Retry view</Button>
          <Button asChild variant="outline">
            <Link href="/login">Choose demo account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
