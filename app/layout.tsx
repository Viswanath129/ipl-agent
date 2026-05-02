import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL Influence Engine — AI-Powered Sponsor Intelligence",
  description: "Measure sponsor ROI, analyze fan sentiment, and generate viral IPL debates with AI.",
  keywords: ["IPL", "sponsor ROI", "fan sentiment", "AI analytics", "cricket"],
  authors: [{ name: "IPL Influence Engine" }],
  openGraph: {
    title: "IPL Influence Engine",
    description: "AI-powered sponsor intelligence and debate analytics platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#02040a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
