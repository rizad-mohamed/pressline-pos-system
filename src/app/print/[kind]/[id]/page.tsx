import { notFound } from "next/navigation";
import { PrintDocument } from "@/features/printing/document";
export default async function Page({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = await params;
  if (kind !== "receipt" && kind !== "job") notFound();
  return <PrintDocument orderId={id} kind={kind} />;
}
