import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL Influence Engine",
  description: "AI-powered sponsor intelligence, fan sentiment, and debate analytics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
