import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Pressline · Print shop workspace",
  description: "Two-branch printing shop frontend demonstration. Local data only.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
