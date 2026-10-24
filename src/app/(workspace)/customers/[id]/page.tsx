import { CustomerDetail } from "@/features/customers/detail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetail customerId={id} />;
}
