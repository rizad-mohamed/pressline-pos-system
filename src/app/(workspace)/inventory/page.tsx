import { Suspense } from "react";
import { Inventory } from "@/features/inventory/inventory";
import { SkeletonPage } from "@/components/shared/presentation";
export default function Page() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <Inventory />
    </Suspense>
  );
}
