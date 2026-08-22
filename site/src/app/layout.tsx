import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  createPageMetadata,
  siteDescription,
  siteName,
} from "@/lib/metadata";
import { absoluteUrl, isIndexableDeployment, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteName,
    description: siteDescription,
    pathname: "/",
  }),
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s / Giacomo Cappelletto",
  },
  authors: [{ name: siteName, url: absoluteUrl("/") }],
  creator: siteName,
  robots: {
    index: isIndexableDeployment,
    follow: isIndexableDeployment,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  initialScale: 1,
  themeColor: "#0b0b0a",
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <span className="page-progress" aria-hidden="true" />
        {children}
        <Footer />
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
