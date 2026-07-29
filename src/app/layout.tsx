import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftSecure | Workforce continuity",
  description: "Fill urgent shifts, secure transportation, control spending, and verify arrival.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
