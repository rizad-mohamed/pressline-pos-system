import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-pressline",
  display: "swap",
});
import { DemoProvider } from "@/data/provider";
import { MobileViewport } from "@/components/layout/mobile-viewport";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};
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
    <html lang="en" className={manrope.variable}>
      <body>
        <DemoProvider>
          <MobileViewport />
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
