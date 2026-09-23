import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond } from "next/font/google";

import { GoogleAnalyticsHead } from "@/components/google-analytics";
import { GoogleAnalyticsTracker } from "@/components/google-analytics-tracker";
import { RootChromeFrame } from "@/components/root-chrome-frame";
import { StructuredData } from "@/components/structured-data";
import { VercelAnalytics } from "@/components/vercel-analytics";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "home services",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  referrer: "origin-when-cross-origin",
  authors: [{ name: siteConfig.name }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/images/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <GoogleAnalyticsHead />
      </head>
      <body className="min-h-full bg-[var(--color-paper)] text-[var(--color-ink)]">
        <StructuredData data={[buildWebsiteSchema(), buildOrganizationSchema()]} />
        <RootChromeFrame settings={settings}>{children}</RootChromeFrame>
        <VercelAnalytics />
        <GoogleAnalyticsTracker />
      </body>
    </html>
  );
}
