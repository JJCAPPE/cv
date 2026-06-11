import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Giacomo Cappelletto",
    template: "%s / Giacomo Cappelletto",
  },
  description:
    "Computer Engineering student at Boston University building software systems, applied ML tools, and computer vision pipelines for biomechanics.",
  keywords: [
    "software engineering",
    "machine learning",
    "computer vision",
    "Boston University",
    "rowing biomechanics",
    "full-stack",
    "Rust",
    "Tauri",
    "Next.js",
  ],
  authors: [{ name: "Giacomo Cappelletto" }],
  creator: "Giacomo Cappelletto",
  openGraph: {
    title: "Giacomo Cappelletto",
    description:
      "Software systems, applied ML, and computer vision for biomechanics.",
    type: "website",
    url: siteUrl,
    siteName: "Giacomo Cappelletto",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giacomo Cappelletto",
    description:
      "Software systems, applied ML, and computer vision for biomechanics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
