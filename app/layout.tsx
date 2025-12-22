import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Become Better - Goal Tracking",
  description: "Track your goals and become a better version of yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

