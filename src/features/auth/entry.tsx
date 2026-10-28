"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/data/provider";
import { SkeletonPage } from "@/components/shared/presentation";

// Only the root entry selects a landing route. Deep links and /login keep their behavior.
export function Entry() {
  const { data, user, recoveryRequired } = useDemoState();
  const router = useRouter();
  useEffect(() => {
    if (data)
      router.replace(user && !recoveryRequired ? "/dashboard" : "/login");
  }, [data, user, recoveryRequired, router]);
  return (
    <main className="entry-loading" aria-label="Opening workspace">
      <SkeletonPage />
    </main>
  );
}
