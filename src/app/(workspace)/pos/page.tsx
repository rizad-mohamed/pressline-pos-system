import { Composer } from "@/features/pos/composer";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string | string[] }>;
}) {
  const params = await searchParams;
  const id = typeof params.customer === "string" ? params.customer : undefined;
  return <Composer key={id ?? "draft"} initialCustomerId={id} />;
}
