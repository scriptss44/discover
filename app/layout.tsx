import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Bank UI",
  description: "Mock banking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
