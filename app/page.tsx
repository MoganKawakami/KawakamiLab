import type { Metadata } from "next";
import "./styles/desktop.css";
import "./styles/mobile.css";
import "./styles/crystal.css";
import "./globals.css";
import Site from "@/components/Site";

// Keep homepage sharing metadata local so fortune result cards remain independent.
const shareImage = {
  url: "https://kwakamilab.vercel.app/images/og/home-v1.png",
  width: 1735,
  height: 907,
  alt: "KAWAKAMI Lab. — 推しを信じて描く。",
};

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: "https://kwakamilab.vercel.app/",
    title: "KAWAKAMI Lab.",
    description: "推しを描く。可愛く描く。ただそれだけ。 KAWAKAMI Lab. — creative laboratory.",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAWAKAMI Lab.",
    description: "推しを描く。可愛く描く。ただそれだけ。 KAWAKAMI Lab. — creative laboratory.",
    images: [shareImage],
  },
};

export default function Home() {
  return <Site />;
}
