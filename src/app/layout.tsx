import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/data/provider";
export const metadata: Metadata = {
  title: "Pressline · Print shop workspace",
  description:
    "Two-branch printing shop frontend demonstration. Local data only.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
