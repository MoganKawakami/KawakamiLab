import "./globals.css";
import type { Metadata } from "next";
import Opening from "@/components/animations/Opening";

export const metadata: Metadata = {
  title: "My Site",
  description: "Next.js + Framer Motion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Opening />
        {children}
      </body>
    </html>
  );
}
