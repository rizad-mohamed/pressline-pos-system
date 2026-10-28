import { Suspense } from "react";
import { OrderList } from "@/features/orders/list";
import { SkeletonPage } from "@/components/shared/presentation";
export default function Page() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <OrderList />
    </Suspense>
  );
}
