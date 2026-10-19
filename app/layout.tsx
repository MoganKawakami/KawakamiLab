import type { Metadata, Viewport } from "next";

/* absolute base for share-card URLs; Vercel provides the production domain */
const site = process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const siteUrl = new URL(site);
if (!["http:", "https:"].includes(siteUrl.protocol)) throw new Error("SITE_URL must be an absolute HTTP(S) URL");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "KAWAKAMI Lab.",
  description: "推しを描く。可愛く描く。ただそれだけ。 KAWAKAMI Lab. — creative laboratory.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
